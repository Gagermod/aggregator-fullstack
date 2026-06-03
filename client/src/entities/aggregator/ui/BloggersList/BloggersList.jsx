import { memo } from 'react'
import styles from './BloggersList.module.scss'
import { BloggersItem } from '@/entities/aggregator'

const BloggersList = (props) => {
  const { bloggersData } = props

  const {
    bloggersToShow,
    toggleFavoriteBlogger,
    searchQuery,
    selectBlogger,
    selectedBloggerId,
  } = bloggersData

  if (bloggersToShow.length === 0 && searchQuery) {
    return <div className={styles.notFoundBlogger}>not_found</div>
  }

  return (
    <ul className={styles.bloggersList}>
      {bloggersToShow.map((blogger) => (
        <BloggersItem
          key={blogger.id}
          searchQuery={searchQuery}
          selectBlogger={selectBlogger}
          selectedBloggerId={selectedBloggerId}
          toggleFavoriteBlogger={() => toggleFavoriteBlogger(blogger.id)}
          {...blogger}
        />
      ))}
    </ul>
  )
}

export default memo(BloggersList)
