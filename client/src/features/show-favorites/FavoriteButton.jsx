import Checkbox from '@/shared/ui/Checkbox'
import styles from './FavoriteButton.module.scss'

const FavoriteButton = (props) => {
  const { bloggersData } = props

  const {
    showOnlyFavorites,
    handleToggleMode,
    sortByPopularity,
    toggleSortByPopularity,
  } = bloggersData

  return (
    <div className={styles.favoriteButton}>
      <Checkbox
        id='favoriteButton'
        name='Show only favorites'
        text='SHOW_FAVORITES'
        checked={showOnlyFavorites}
        onChange={handleToggleMode}
      />
      <Checkbox
        id='sortByPopularityButton'
        name='Sort by popularity'
        text='SORT_BY_POPULARITY'
        checked={sortByPopularity}
        onChange={toggleSortByPopularity}
      />
    </div>
  )
}

export default FavoriteButton
