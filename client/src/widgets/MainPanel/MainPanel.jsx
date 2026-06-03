import { useState } from 'react'
import { toast } from 'react-toastify'
import { useAuthStore } from '@/app/store'
import { BloggerService } from '@/features/blogger/api/blogger.api'
import AddContentModal from '@/features/blogger/ui/AddContentModal'
import styles from './MainPanel.module.scss'

const MainPanel = (props) => {
  const { bloggersData, onLinkHover, isMenuOpen } = props
  const {
    categories,
    bloggerContent,
    selectedBlogger,
    selectedCategory,
    selectCategory,
  } = bloggersData

  const { role, incrementDataVersion } = useAuthStore()
  const isAdmin = role === 'admin'
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAddContent = () => {
    setIsModalOpen(true)
  }

  const handleModalSubmit = async ({ title, url, type }) => {
    try {
      await BloggerService.addContent(selectedBlogger.id, {
        title,
        url,
        type,
      })
      toast.success('Content added!')
      incrementDataVersion()
    } catch (error) {
      toast.error('Failed to add content.')
    }
  }

  const handleRemoveContent = async (e, link) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm(`Are you sure you want to delete "${link.title}"?`)) return

    try {
      await BloggerService.removeContent(selectedBlogger.id, {
        url: link.url,
        type: selectedCategory,
      })
      toast.success('Content removed!')
      incrementDataVersion()
    } catch (error) {
      toast.error('Failed to remove content.')
    }
  }

  const currentLinks = bloggerContent[selectedCategory] || []
  const hasContent = (category) => bloggerContent[category]?.length > 0

  return (
    <div className={styles.mainPanel}>
      <AddContentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        category={selectedCategory}
      />
      <div className={styles.categoriesWrapper}>
        <ul
          className={`${styles.categories} ${
            isMenuOpen ? styles['categories--hidden'] : ''
          }`}
        >
          {categories.map((category) => {
            const isAvailable = hasContent(category)
            return (
              <li className={styles.categoryItem} key={category}>
                <button
                  className={`${styles.categoryButton} ${
                    selectedCategory === category ? styles.selected : ''
                  } ${!isAvailable && !isAdmin ? styles.disabled : ''}`}
                  onClick={() => selectCategory(category)}
                  disabled={!isAvailable && !isAdmin}
                >
                  {category}
                </button>
              </li>
            )
          })}
          {isAdmin && (
            <li>
              <button
                className={`${styles.categoryButton} ${styles.addButton}`}
                onClick={handleAddContent}
                title={`Add to ${selectedCategory}`}
              >
                +
              </button>
            </li>
          )}
        </ul>
      </div>
      <ul className={styles.linkList}>
        {currentLinks.map((link) => (
          <li
            className={styles.item}
            key={link.url}
            onMouseEnter={() => onLinkHover(link.url)}
            onMouseLeave={() => onLinkHover(null)}
          >
            <a
              className={styles.linkContainer}
              href={link.url}
              target='_blank'
              rel='noopener noreferrer'
            >
              <span className={styles.link}>{link.title}</span>
              <div className={styles.linkMeta}>
                <span className={styles.linkSign}>CLICK TO OPEN</span>
                <div className={styles.metaRight}>
                  <span className={styles.linkType}>
                    FORMAT: {selectedCategory.toUpperCase()}
                  </span>
                  {isAdmin && (
                    <button
                      className={styles.removeButton}
                      onClick={(e) => handleRemoveContent(e, link)}
                      title='Remove this content'
                    >
                      -
                    </button>
                  )}
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MainPanel
