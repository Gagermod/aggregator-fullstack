import { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify'
import { useAuthStore } from '@/app/store'
import { BloggerService } from '@/features/blogger/api/blogger.api'
import CustomSelect from '@/shared/ui/CustomSelect'
import { BurgerMenuContext } from '@/app/providers/BurgerMenuProvider'
import styles from './Admin.module.scss'

const Admin = () => {
  const [suggestions, setSuggestions] = useState([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true)
  const [titles, setTitles] = useState({})
  const [photos, setPhotos] = useState({})
  const [showSuggestions, setShowSuggestions] = useState(false)

  const [bloggers, setBloggers] = useState([])
  const [contentTypes, setContentTypes] = useState([])
  const [selectedBlogger, setSelectedBlogger] = useState('')
  const [otherBlogger, setOtherBlogger] = useState('')
  const [selectedContentType, setSelectedContentType] = useState('')
  const [otherContentType, setOtherContentType] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newPhoto, setNewPhoto] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { setIsBurgerVisible } = useContext(BurgerMenuContext)
  const incrementDataVersion = useAuthStore(
    (state) => state.incrementDataVersion
  )

  useEffect(() => {
    if (showSuggestions) {
      setIsBurgerVisible(false)
    } else {
      setIsBurgerVisible(true)
    }
    return () => setIsBurgerVisible(true)
  }, [showSuggestions, setIsBurgerVisible])

  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoadingSuggestions(true)
      try {
        const data = await BloggerService.getPendingSuggestions()
        setSuggestions(data)
      } catch (error) {
        toast.error('Failed to load suggestions.')
      } finally {
        setIsLoadingSuggestions(false)
      }
    }

    const fetchFormData = async () => {
      try {
        const [bloggerData, types] = await Promise.all([
          BloggerService.getAllBloggerNames(),
          BloggerService.getContentTypes(),
        ])
        setBloggers(bloggerData)
        setContentTypes(types)
      } catch (error) {
        toast.error('Failed to load form data.')
      }
    }

    fetchSuggestions()
    fetchFormData()
  }, [])

  const handleTitleChange = (id, value) => setTitles((prev) => ({ ...prev, [id]: value }))
  const handlePhotoChange = (id, file) => setPhotos((prev) => ({ ...prev, [id]: file }))

  const handleApprove = async (id) => {
    const formData = new FormData()
    if (titles[id]) formData.append('title', titles[id])
    if (photos[id]) formData.append('photo', photos[id])

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

  const handleDirectAddSubmit = async (e) => {
    e.preventDefault()
    const bloggerName = selectedBlogger === 'other' ? otherBlogger : selectedBlogger
    const contentType = selectedContentType === 'other' ? otherContentType : selectedContentType

    if (!bloggerName || !contentType || !newTitle || !newUrl) {
      return toast.error('Please fill all required fields.')
    }

    setIsSubmitting(true)
    const suggestionData = {
      bloggerName,
      contentType,
      links: [{ title: newTitle, url: newUrl, type: contentType }],
    }

    try {
      const createdSuggestion = await BloggerService.createSuggestion(suggestionData)
      const formData = new FormData()
      formData.append('title', newTitle)
      if (newPhoto) {
        formData.append('photo', newPhoto)
      }

      await BloggerService.approveSuggestion(createdSuggestion.id, formData)
      toast.success('Content added and approved successfully!')
      incrementDataVersion()

      setOtherBlogger('')
      setOtherContentType('')
      setNewTitle('')
      setNewUrl('')
      setNewPhoto(null)
    } catch (error) {
      toast.error('Failed to add content.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const bloggerOptions = [
    ...bloggers.map((name) => ({ value: name, label: name })),
    { value: 'other', label: 'Other' },
  ]
  const contentTypeOptions = [
    ...contentTypes.map((type) => ({ value: type, label: type })),
    { value: 'other', label: 'Other' },
  ]

  return (
    <div className={styles.adminContainer}>
      <div className={`${styles.leftColumn} ${showSuggestions ? styles.mobileOverlay : ''}`}>
        <button
          className={styles.closeSuggestionsButton}
          onClick={() => setShowSuggestions(false)}
        >
          Close
        </button>
        <h2>Pending Suggestions</h2>
        {isLoadingSuggestions ? (
          <p>Loading suggestions...</p>
        ) : suggestions.length === 0 ? (
          <p>No pending suggestions.</p>
        ) : (
          <div className={styles.listWrapper}>
            <ul className={styles.suggestionList}>
              {suggestions.map((s) => (
                <li key={s.id} className={styles.suggestionItem}>
                  <div className={styles.suggestionDetails}>
                    <p><strong>Blogger:</strong> <span className={styles.value}>{s.bloggerName}</span></p>
                    <p><strong>Type:</strong> <span className={styles.value}>{s.contentType}</span></p>
                    <p><strong>Link:</strong> <a href={s.links[0].url} target="_blank" rel="noopener noreferrer">{s.links[0].title}</a></p>
                    {s.submittedBy && <p><strong>Submitted by:</strong> <span className={styles.value}>{s.submittedBy.login}</span></p>}
                    <input type="text" placeholder="Custom title (optional)" className={styles.titleInput} value={titles[s.id] || ''} onChange={(e) => handleTitleChange(s.id, e.target.value)} />
                    <input type="file" accept="image/*" className={styles.photoInput} onChange={(e) => handlePhotoChange(s.id, e.target.files[0])} />
                  </div>
                  <div className={styles.actions}>
                    <button onClick={() => handleApprove(s.id)} className={styles.approveButton}>Approve</button>
                    <button onClick={() => handleReject(s.id)} className={styles.rejectButton}>Reject</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className={styles.rightColumn}>
        <h2>Direct Add Content</h2>
        <form onSubmit={handleDirectAddSubmit} className={styles.directAddForm}>
          <CustomSelect options={bloggerOptions} value={selectedBlogger} onChange={setSelectedBlogger} placeholder="Select Blogger" />
          {selectedBlogger === 'other' && (
            <input type="text" placeholder="New Blogger Name" value={otherBlogger} onChange={(e) => setOtherBlogger(e.target.value)} className={styles.titleInput} required />
          )}
          <CustomSelect options={contentTypeOptions} value={selectedContentType} onChange={setSelectedContentType} placeholder="Select Content Type" />
          {selectedContentType === 'other' && (
            <input type="text" placeholder="New Content Type" value={otherContentType} onChange={(e) => setOtherContentType(e.target.value)} className={styles.titleInput} required />
          )}
          <input type="text" placeholder="Content Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className={styles.titleInput} required />
          <input type="url" placeholder="Content URL" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} className={styles.titleInput} required />
          <input type="file" accept="image/*" className={styles.photoInput} onChange={(e) => setNewPhoto(e.target.files[0])} />
          <button type="submit" className={styles.approveButton} disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Content'}
          </button>
        </form>
        <button
          className={styles.showSuggestionsButton}
          onClick={() => setShowSuggestions(true)}
        >
          Show Pending ({suggestions.length})
        </button>
      </div>
    </div>
  )
}

export default Admin
