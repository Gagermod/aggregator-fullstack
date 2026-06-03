import { useState, useRef, useEffect } from 'react'
import styles from './CustomSelect.module.scss'

const CustomSelect = ({ options, value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef(null)

  const handleSelect = (optionValue) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const selectedOption = options.find((option) => option.value === value)

  return (
    <div className={`${styles.selectWrapper} ${className}`} ref={selectRef}>
      <div className={styles.selectHeader} onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedOption ? selectedOption.label : 'Select...'}</span>
        <div className={`${styles.arrow} ${isOpen ? styles.open : ''}`} />
      </div>
      {isOpen && (
        <ul className={styles.optionsList}>
          {options.map((option) => (
            <li
              key={option.value}
              className={styles.option}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CustomSelect
