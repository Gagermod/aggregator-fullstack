import { instance } from '@/shared/api/axios.api'

export const AuthService = {
  async registration(userData) {
    const { data } = await instance.post('user', userData)
    return data
  },
  async login(userData) {
    const { data } = await instance.post('auth/login', userData)
    return data
  },
  async getProfile() {
    const { data } = await instance.get('auth/profile')
    return data
  },
  async toggleFavorite(bloggerId) {
    const { data } = await instance.post(`user/favorites/${bloggerId}`)
    return data
  },
  async syncFavorites(bloggerIds) {
    const { data } = await instance.post('user/favorites/sync', { bloggerIds })
    return data
  },
}
