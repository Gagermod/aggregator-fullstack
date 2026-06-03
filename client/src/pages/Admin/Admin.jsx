import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAuthStore } from '@/app/store'
import { BloggerService } from '@/features/blogger/api/blogger.api'
import styles from './Admin.module.scss'

const Admin = () => {
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [titles, setTitles] = useState({})
  const [photos, setPhotos] = useState({})

  const incrementDataVersion = useAuthStore(
    (state) => state.incrementDataVersion
  )

  const fetchSuggestions = async () => {
    setIsLoading(true)
    try {
      const data = await BloggerService.getPendingSuggestions()
      setSuggestions(data)
    } catch (error) {
      toast.error('Failed to load suggestions.')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSuggestions()
  }, [])

  const handleTitleChange = (id, value) => {
    setTitles((prev) => ({ ...prev, [id]: value }))
  }

  const handlePhotoChange = (id, file) => {
    setPhotos((prev) => ({ ...prev, [id]: file }))
  }

  const handleApprove = async (id) => {
    const formData = new FormData()
    if (titles[id]) {
      formData.append('title', titles[id])
    }
    if (photos[id]) {
      formData.append('photo', photos[id])
    }

    try {
      await BloggerService.approveSuggestion(id, formData)
      toast.success('Suggestion approved!')
      incrementDataVersion()
      setSuggestions((prev) => prev.filter((s) => s.id !== id))
    } catch (error) {
      toast.error('Failed to approve suggestion.')
    }
  }

  const handleReject = async (id) => {
    try {
      await BloggerService.rejectSuggestion(id)
      toast.warning('Suggestion rejected.')
      setSuggestions((prev) => prev.filter((s) => s.id !== id))
    } catch (error) {
      toast.error('Failed to reject suggestion.')
    }
  }

  if (isLoading) {
    return <div>Loading suggestions...</div>
  }

  return (
    <div className={styles.adminPanel}>
      <h1>Pending Suggestions</h1>
      {suggestions.length === 0 ? (
        <p>No pending suggestions.</p>
      ) : (
        <ul className={styles.suggestionList}>
          {suggestions.map((s) => (
            <li key={s.id} className={styles.suggestionItem}>
              <div className={styles.suggestionDetails}>
                <p><strong>Blogger:</strong> {s.bloggerName}</p>
                <p><strong>Type:</strong> {s.contentType}</p>
                <p><strong>Link:</strong> <a href={s.links[0].url} target="_blank" rel="noopener noreferrer">{s.links[0].title}</a></p>
                <input
                  type="text"
                  placeholder="Enter custom title (optional)"
                  className={styles.titleInput}
                  value={titles[s.id] || ''}
                  onChange={(e) => handleTitleChange(s.id, e.target.value)}
                />
                <input
                  type="file"
                  accept="image/*"
                  className={styles.photoInput}
                  onChange={(e) => handlePhotoChange(s.id, e.target.files[0])}
                />
              </div>
              <div className={styles.actions}>
                <button onClick={() => handleApprove(s.id)} className={styles.approveButton}>Approve</button>
                <button onClick={() => handleReject(s.id)} className={styles.rejectButton}>Reject</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Admin
