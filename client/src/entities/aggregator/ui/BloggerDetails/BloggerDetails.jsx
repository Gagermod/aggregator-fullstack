import { toast } from 'react-toastify'
import { useAuthStore } from '@/app/store'
import { BloggerService } from '@/features/blogger/api/blogger.api'
import Panel from '@/shared/ui/Panel'
import PanelTitle from '@/shared/ui/PanelTitle'
import { getDomain } from '@/shared/utils/getDomain'
import styles from './BloggerDetails.module.scss'

const BloggerDetails = (props) => {
  const { bloggersData, hoveredLinkUrl, isMenuOpen } = props

  const { selectedBlogger, categories, bloggerContent } = bloggersData

  const { role } = useAuthStore()
  const isAdmin = role === 'admin'

  const handleRemoveBlogger = async () => {
    if (
      !confirm(
        `Are you sure you want to permanently delete "${selectedBlogger.name}" and all their content?`
      )
    )
      return

    try {
      await BloggerService.removeBlogger(selectedBlogger.id)
      toast.success(`Blogger "${selectedBlogger.name}" has been deleted.`)
      useAuthStore.getState().incrementDataVersion()
    } catch (error) {
      toast.error('Failed to delete blogger.')
    }
  }

  if (!selectedBlogger) {
    return (
      <Panel>
        <PanelTitle title='profile' additionalDecor='--status' />
      </Panel>
    )
  }

  const availableCategories = categories.filter(
    (category) => bloggerContent[category]?.length > 0
  )

  const availableCategoriesFormatted = availableCategories
    .map((category) => category.toLowerCase())
    .join(', ')

  const domain = getDomain(hoveredLinkUrl)

  return (
    <Panel>
      <PanelTitle title='profile' additionalDecor='--status' />
      <img
        className={styles.bloggerImage}
        src={selectedBlogger.link}
        alt=''
        width={400}
        height={400}
        loading='lazy'
      />
      <div
        className={`${styles.bloggerStatus} ${isMenuOpen ? styles.hidden : ''}`}
      >
        <h3 className={styles.bloggerName}>{selectedBlogger.name}</h3>
        <div className={styles.domain}>{domain || 'no_info'}</div>
        <div className={styles.views}>{selectedBlogger.views || 0}</div>
        <div className={styles.status}>{availableCategoriesFormatted}</div>

        {isAdmin && (
          <div className={styles.adminActions}>
            <button
              className={styles.removeBloggerButton}
              onClick={handleRemoveBlogger}
            >
              Delete Blogger
            </button>
          </div>
        )}
      </div>
    </Panel>
  )
}

export default BloggerDetails
