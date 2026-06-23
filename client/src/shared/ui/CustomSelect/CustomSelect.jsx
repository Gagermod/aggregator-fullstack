import { useState, useRef, useEffect } from 'react'
import { highlightCaseInsensitive } from '@/shared/utils/highlight'
import styles from './CustomSelect.module.scss'

const CustomSelect = ({ options, value, onChange, className, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const selectRef = useRef(null)

  const handleSelect = (optionValue) => {
    onChange(optionValue)
    setIsOpen(false)
    setSearchQuery('')
  }

  const handleClear = () => {
    setSearchQuery('')
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const otherOption = options.find((option) => option.value === 'other')
  const regularOptions = options.filter((option) => option.value !== 'other')

  const filteredOptions = regularOptions.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedOption = options.find((option) => option.value === value)

  return (
    <div className={`${styles.selectWrapper} ${className}`} ref={selectRef}>
      <div className={styles.selectHeader} onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedOption ? selectedOption.label : placeholder || 'Select...'}</span>
        <div className={`${styles.arrow} ${isOpen ? styles.open : ''}`} />
      </div>
      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.searchWrapper}>
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={handleClear}
              >
                DEL
              </button>
            )}
          </div>
          {otherOption && (
            <div
              className={`${styles.option} ${styles.otherOption}`}
              onClick={() => handleSelect(otherOption.value)}
            >
              {otherOption.label}
            </div>
          )}
          <ul className={styles.optionsList}>
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                className={styles.option}
                onClick={() => handleSelect(option.value)}
                dangerouslySetInnerHTML={{
                  __html: highlightCaseInsensitive(option.label, searchQuery),
                }}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default CustomSelect
