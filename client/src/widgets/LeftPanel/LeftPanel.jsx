import BloggersList from '@/entities/aggregator/ui/BloggersList'
import SearchBloggerForm from '@/features/search-blogger'
import FavoriteButton from '@/features/show-favorites'
import Panel from '@/shared/ui/Panel'
import PanelTitle from '@/shared/ui/PanelTitle'
import styles from './LeftPanel.module.scss'

const LeftPanel = (props) => {
  const { bloggersData } = props

  return (
    <Panel className={styles.leftPanel}>
      <PanelTitle title='authors' />
      <div className={styles.leftPanelControls}>
        <SearchBloggerForm bloggersData={bloggersData} />
        <div className={styles.controlsGroup}>
          <FavoriteButton bloggersData={bloggersData} />

        </div>
      </div>
      <BloggersList bloggersData={bloggersData} />
    </Panel>
  )
}

export default LeftPanel
