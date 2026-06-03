import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { BloggerService } from '@/features/blogger/api/blogger.api'
import CustomSelect from '@/shared/ui/CustomSelect'
import styles from './Suggest.module.scss'

const Suggest = () => {
  const [author, setAuthor] = useState('')
  const [otherAuthor, setOtherAuthor] = useState('')
  const [contentType, setContentType] = useState('')
  const [otherContentType, setOtherContentType] = useState('')
  const [contentLink, setContentLink] = useState('')
  const [bloggerNames, setBloggerNames] = useState([])
  const [contentTypes, setContentTypes] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [names, types] = await Promise.all([
          BloggerService.getAllBloggerNames(),
          BloggerService.getContentTypes(),
        ])
        setBloggerNames(names)
        setContentTypes(types)
        if (names.length > 0) {
          setAuthor(names[0])
        }
        if (types.length > 0) {
          setContentType(types[0])
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
        toast.error('Could not load form data.')
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const finalAuthor = author === 'other' ? otherAuthor : author
    const finalContentType =
      contentType === 'other' ? otherContentType : contentType

    const suggestionData = {
      bloggerName: finalAuthor,
      contentType: finalContentType,
      links: [
        {
          title: `${finalAuthor} - ${finalContentType}`,
          url: contentLink,
          type: finalContentType,
        },
      ],
    }

    try {
      await BloggerService.createSuggestion(suggestionData)
      toast.success('Suggestion sent successfully!')
      
      setOtherAuthor('')
      setOtherContentType('')
      setContentLink('')
      if (bloggerNames.length > 0) setAuthor(bloggerNames[0])
      if (contentTypes.length > 0) setContentType(contentTypes[0])
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to send suggestion'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const authorOptions = [
    ...bloggerNames.map((name) => ({ value: name, label: name })),
    { value: 'other', label: 'Other' },
  ]

  const contentTypeOptions = [
    ...contentTypes.map((type) => ({ value: type, label: type })),
    { value: 'other', label: 'Other' },
  ]

  return (
    <div>
      <div className={styles.titleContainer}>
        <h1>Suggest content</h1>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <CustomSelect
          options={authorOptions}
          value={author}
          onChange={(value) => setAuthor(value)}
          disabled={isLoading}
        />
        {author === 'other' && (
          <input
            type='text'
            value={otherAuthor}
            onChange={(e) => setOtherAuthor(e.target.value)}
            required
            placeholder='New Author Name'
            className={styles.input}
            disabled={isLoading}
          />
        )}
        <CustomSelect
          options={contentTypeOptions}
          value={contentType}
          onChange={(value) => setContentType(value)}
          disabled={isLoading}
        />
        {contentType === 'other' && (
          <input
            type='text'
            value={otherContentType}
            onChange={(e) => setOtherContentType(e.target.value)}
            required
            placeholder='New Content Type'
            className={styles.input}
            disabled={isLoading}
          />
        )}
        <input
          type='url'
          value={contentLink}
          onChange={(e) => setContentLink(e.target.value)}
          required
          placeholder='Content Link'
          className={styles.input}
          disabled={isLoading}
        />
        <button type='submit' className={styles.submit} disabled={isLoading}>
          {isLoading ? 'SENDING...' : 'SUBMIT'}
        </button>
      </form>
    </div>
  )
}

export default Suggest
