import { useState } from 'react'
import Modal from '@/shared/ui/Modal'
import styles from './AddContentModal.module.scss'

const AddContentModal = ({ isOpen, onClose, onSubmit, category }) => {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ title, url, type: category })
    setTitle('')
    setUrl('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Add new content to "{category}"</h2>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="url">URL</label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Add Content
        </button>
      </form>
    </Modal>
  )
}

export default AddContentModal
