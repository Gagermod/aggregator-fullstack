import { toast } from 'react-toastify'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthService } from '@/features/authenticate/api/auth.api'
import { setAuthHeader, clearAuthHeader } from '@/shared/api/axios.api'
import { setTokenToLocalStorage } from '@/shared/utils/tokenUtil'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,
      favoriteBloggerIds: [],
      role: null,
      dataVersion: 1,
      viewedBloggerIds: [],

      addViewedBlogger: (bloggerId) =>
        set((state) => ({
          viewedBloggerIds: [...state.viewedBloggerIds, bloggerId],
        })),

      incrementDataVersion: () =>
        set((state) => ({ dataVersion: state.dataVersion + 1 })),

      checkAuth: async () => {
        const token = localStorage.getItem('token')
        if (!token) {
          set({
            favoriteBloggerIds: [],
            role: null,
            viewedBloggerIds: [],
            isLoading: false,
          })
          clearAuthHeader()
          return false
        }

        setAuthHeader(token)
        set({ isLoading: true })
        try {
          const user = await AuthService.getProfile()
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            favoriteBloggerIds: user.favoriteBloggers.map((b) => b.id),
            role: user.role,
            viewedBloggerIds: user.viewedBloggerIds || [],
          })
          return true
        } catch (err) {
          localStorage.removeItem('token')
          clearAuthHeader()
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            favoriteBloggerIds: [],
            role: null,
            viewedBloggerIds: [],
          })
          return false
        }
      },

      login: async (login, password) => {
        set({ isLoading: true, error: null })
        try {
          const data = await AuthService.login({ login, password })
          setTokenToLocalStorage(data.token)
          setAuthHeader(data.token)

          set({
            user: data,
            isAuthenticated: true,
            isLoading: false,
            favoriteBloggerIds: data.favoriteBloggers.map((b) => b.id),
            role: data.role,
            viewedBloggerIds: data.viewedBloggerIds || [],
          })

          return { success: true, data }
        } catch (err) {
          const error = Array.isArray(err.response?.data?.message)
            ? err.response.data.message.join(', ')
            : err.response?.data?.message || 'Login failed'
          set({ error, isLoading: false })
          toast.error(error)
          return { success: false, error }
        }
      },

      syncLocalFavorites: async () => {
        const localFavorites = JSON.parse(
          localStorage.getItem('favorites') || '[]'
        )
        if (localFavorites.length > 0) {
          try {
            const { favoriteBloggerIds } =
              await AuthService.syncFavorites(localFavorites)
            set({ favoriteBloggerIds })
          } catch (error) {
            const errorMessage =
              error.response?.data?.message || 'Failed to sync local favorites.'
            console.error('Failed to sync local favorites:', error)
            toast.error(errorMessage)
          }
        }
      },

      registration: async (login, password) => {
        set({ isLoading: true, error: null })
        try {
          await AuthService.registration({ login, password })

          const data = await AuthService.login({ login, password })
          setTokenToLocalStorage(data.token)
          setAuthHeader(data.token)

          const localFavorites = JSON.parse(
            localStorage.getItem('favorites') || '[]'
          )
          let finalFavorites = []

          if (localFavorites.length > 0) {
            const { favoriteBloggerIds } =
              await AuthService.syncFavorites(localFavorites)
            finalFavorites = favoriteBloggerIds
          }

          set({
            user: data,
            isAuthenticated: true,
            isLoading: false,
            favoriteBloggerIds: finalFavorites,
            role: data.role,
            viewedBloggerIds: data.viewedBloggerIds || [],
          })

          return { success: true }
        } catch (err) {
          const error = Array.isArray(err.response?.data?.message)
            ? err.response.data.message.join(', ')
            : err.response?.data?.message || 'Registration failed'
          set({ error, isLoading: false })
          toast.error(error)
          return { success: false, error }
        }
      },

      logout: () => {
        clearAuthHeader()
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          favoriteBloggerIds: [],
          role: null,
          viewedBloggerIds: [],
        })
        localStorage.removeItem('token')
      },

      toggleFavorite: async (bloggerId) => {
        if (!get().isAuthenticated) return

        try {
          const { favoriteBloggerIds } =
            await AuthService.toggleFavorite(bloggerId)
          set({ favoriteBloggerIds })
        } catch (err) {
          const errorMessage =
            err.response?.data?.message || 'Failed to toggle favorite.'
          console.error('Failed to toggle favorite:', err)
          toast.error(errorMessage)
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        favoriteBloggerIds: state.favoriteBloggerIds,
        role: state.role,
        dataVersion: state.dataVersion,
        viewedBloggerIds: state.viewedBloggerIds,
      }),
    }
  )
)

export default useAuthStore
