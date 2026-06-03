import { instance as api } from '@/shared/api/axios.api'

export const BloggerService = {
  async getContentTypes() {
    const response = await api.get('/blogger/content-types')
    return response.data
  },

  async createSuggestion(data) {
    const response = await api.post('/suggestions', data)
    return response.data
  },

  async getAllBloggerNames() {
    const response = await api.get('/blogger/names')
    return response.data
  },


  async getPendingSuggestions() {
    const response = await api.get('/suggestions?status=pending')
    return response.data
  },

  async approveSuggestion(id, formData) {
    const response = await api.patch(`/suggestions/${id}/approve`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async rejectSuggestion(id) {
    const response = await api.patch(`/suggestions/${id}/reject`)
    return response.data
  },

  async addContent(bloggerId, contentData) {
    const response = await api.post(`/blogger/${bloggerId}/content`, contentData)
    return response.data
  },

  async removeContent(bloggerId, contentData) {
    const response = await api.delete(`/blogger/${bloggerId}/content`, {
      data: contentData,
    })
    return response.data
  },

  async removeBlogger(bloggerId) {
    const response = await api.delete(`/blogger/${bloggerId}`)
    return response.data
  },
}
