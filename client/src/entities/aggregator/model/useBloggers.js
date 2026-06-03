import { useState, useMemo, useCallback, useEffect } from 'react'
import { useAuthStore } from '@/app/store'
import { BloggerAPI } from '../api/blogger.api'
import { bloggerImageMap } from './blogger-images'


const useBloggers = () => {
  const [bloggers, setBloggers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)
  const [sortByPopularity, setSortByPopularity] = useState(false)
  const [hoveredLinkUrl, setHoveredLinkUrl] = useState(null)
  const [guestFavorites, setGuestFavorites] = useState(
    () => JSON.parse(localStorage.getItem('favorites') || '[]')
  )
  const [bloggerCategoryMap, setBloggerCategoryMap] = useState(() => {
    try {
      const savedMap = localStorage.getItem('blogger-category-map')
      return savedMap ? JSON.parse(savedMap) : {}
    } catch {
      return {}
    }
  })

  const {
    isAuthenticated,
    favoriteBloggerIds,
    toggleFavorite,
    dataVersion,
    viewedBloggerIds,
    addViewedBlogger,
  } = useAuthStore()

  useEffect(() => {
    const fetchBloggers = async () => {
      setIsLoading(true)
      try {
        const serverBloggers = await BloggerAPI.getAll()
        const enrichedBloggers = serverBloggers.map((serverBlogger) => {
          return {
            ...serverBlogger,
            link: bloggerImageMap[serverBlogger.id] || serverBlogger.link,
          }
        })
        enrichedBloggers.sort((a, b) => a.name.localeCompare(b.name))
        setBloggers(enrichedBloggers)
      } catch (error) {
        console.error('Failed to fetch bloggers:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBloggers()
  }, [dataVersion])

  const toggleFavoriteBlogger = useCallback(
    (bloggerId) => {
      if (isAuthenticated) {
        toggleFavorite(bloggerId)
      } else {
        const newFavorites = guestFavorites.includes(bloggerId)
          ? guestFavorites.filter((id) => id !== bloggerId)
          : [...guestFavorites, bloggerId]
        setGuestFavorites(newFavorites)
        localStorage.setItem('favorites', JSON.stringify(newFavorites))
      }
    },
    [isAuthenticated, toggleFavorite, guestFavorites]
  )

  const [selectedBloggerId, setSelectedBloggerId] = useState(() => {
    try {
      const savedId = localStorage.getItem('selected-blogger-id')
      return savedId ? JSON.parse(savedId) : '1'
    } catch (error) {
      return '1'
    }
  })

  const selectedBlogger = useMemo(() => {
    return bloggers.find((blogger) => blogger.id === selectedBloggerId)
  }, [bloggers, selectedBloggerId])

  const categories = useMemo(() => {
    if (!selectedBlogger) return []
    return Object.keys(selectedBlogger.content || {}).sort()
  }, [selectedBlogger])

  const bloggerContent = useMemo(() => {
    return selectedBlogger?.content || {}
  }, [selectedBlogger])

  const selectedCategory = useMemo(() => {
    const lastSelected = bloggerCategoryMap[selectedBloggerId]
    if (lastSelected && bloggerContent[lastSelected]?.length > 0) {
      return lastSelected
    }
    const firstAvailable = categories.find(
      (cat) => bloggerContent[cat]?.length > 0
    )
    return firstAvailable || categories[0] || 'MOVIES'
  }, [selectedBloggerId, bloggerCategoryMap, categories, bloggerContent])

  const selectCategory = useCallback(
    (category) => {
      if (!selectedBloggerId) return
      const newMap = { ...bloggerCategoryMap, [selectedBloggerId]: category }
      setBloggerCategoryMap(newMap)
      localStorage.setItem('blogger-category-map', JSON.stringify(newMap))
    },
    [selectedBloggerId, bloggerCategoryMap]
  )

  const handleToggleMode = useCallback(() => {
    setShowOnlyFavorites((prev) => !prev)
    setSearchQuery('')
  }, [])

  const toggleSortByPopularity = useCallback(() => {
    setSortByPopularity((prev) => !prev)
  }, [])

  const bloggersToShow = useMemo(() => {
    const favoriteSource = isAuthenticated
      ? new Set(favoriteBloggerIds)
      : new Set(guestFavorites)

    const currentBloggers = bloggers.map((b) => ({
      ...b,
      isFavorite: favoriteSource.has(b.id),
    }))

    let filteredBySearch = searchQuery
      ? currentBloggers.filter(({ name }) =>
          name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : currentBloggers

    if (showOnlyFavorites) {
      filteredBySearch = filteredBySearch.filter((blogger) => blogger.isFavorite)
    }

    if (sortByPopularity) {
      return [...filteredBySearch].sort((a, b) => (b.views || 0) - (a.views || 0))
    }

    return filteredBySearch
  }, [
    bloggers,
    searchQuery,
    showOnlyFavorites,
    sortByPopularity,
    isAuthenticated,
    favoriteBloggerIds,
    guestFavorites,
  ])

  const selectBlogger = useCallback(
    (id) => {
      setSelectedBloggerId(id)
      localStorage.setItem('selected-blogger-id', JSON.stringify(id))

      if (isAuthenticated && !viewedBloggerIds.includes(id)) {
        BloggerAPI.incrementBloggerView(id)
          .then(() => {
            addViewedBlogger(id)
            setBloggers((prevBloggers) =>
              prevBloggers.map((b) =>
                b.id === id ? { ...b, views: (b.views || 0) + 1 } : b
              )
            )
          })
          .catch((err) => console.error('Failed to increment view:', err))
      }
    },
    [isAuthenticated, viewedBloggerIds, addViewedBlogger]
  )

  return {
    isLoading,
    searchQuery,
    setSearchQuery,
    showOnlyFavorites,
    selectedBloggerId,
    selectBlogger,
    handleToggleMode,
    bloggersToShow,
    toggleFavoriteBlogger,
    categories,
    selectedBlogger,
    bloggerContent,
    hoveredLinkUrl,
    setHoveredLinkUrl,
    selectedCategory,
    selectCategory,
    sortByPopularity,
    toggleSortByPopularity,
  }
}

export default useBloggers
