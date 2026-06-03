import { useContext } from 'react'
import { BurgerMenuContext } from '@/app/providers/BurgerMenuProvider'
import Checkbox from '@/shared/ui/Checkbox'
import { highlightCaseInsensitive } from '@/shared/utils/highlight'
import styles from './BloggersItem.module.scss'
import { API_URL } from '@/shared/api/config'

const BloggersItem = (props) => {
  const {
    id,
    name,
    isFavorite,
    link,
    toggleFavoriteBlogger,
    searchQuery,
    selectBlogger,
    selectedBloggerId,
  } = props

  const { setIsMenuOpen } = useContext(BurgerMenuContext)

  const highlightedName = highlightCaseInsensitive(name, searchQuery)

  const handleClick = () => {
    selectBlogger(id)
    setIsMenuOpen(false)
  }

  const handleToggleFavorite = (event) => {
    toggleFavoriteBlogger(id, event.target.checked)
  }

  const isSelected = selectedBloggerId === id

  const imageUrl = link.startsWith('/bloggers/')
    ? `${API_URL}${link}`
    : link

  return (
    <li
      className={`${styles.bloggersItem} ${isSelected ? styles.selected : ''}`}
      onClick={() => handleClick()}
    >
      <div className={styles.blogger}>
        <img
          className={styles.image}
          src={imageUrl}
          alt={`Фотография ${name}`}
          loading='lazy'
        />
        <h3
          className={styles.bloggerName}
          dangerouslySetInnerHTML={{ __html: highlightedName }}
        />
      </div>
      <Checkbox
        name={name}
        id={id}
        checked={isFavorite}
        onChange={handleToggleFavorite}
      />
    </li>
  )
}

export default BloggersItem
