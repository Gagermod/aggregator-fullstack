import { instance } from '@/shared/api/axios.api'

export const BloggerAPI = {
  async getAll() {
    const { data } = await instance.get('blogger')
    return data
  },

  async incrementBloggerView(id) {
    const { data } = await instance.patch(`blogger/${id}/view`)
    return data
  },
}
