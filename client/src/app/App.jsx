import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { VisualEffectsProvider, BurgerMenuProvider } from '@/app/providers'
import { router } from '@/app/router'
import { useAuthStore } from '@/app/store'

const App = () => {
  const { isAuthenticated, syncLocalFavorites, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (isAuthenticated) {
      syncLocalFavorites()
    }
  }, [isAuthenticated, syncLocalFavorites])

  return (
    <>
      <VisualEffectsProvider />
      <BurgerMenuProvider>
        <RouterProvider router={router} />
      </BurgerMenuProvider>
    </>
  )
}

export default App
