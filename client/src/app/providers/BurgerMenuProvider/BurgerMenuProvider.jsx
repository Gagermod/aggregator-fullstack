import { createContext, useState } from 'react'

export const BurgerMenuContext = createContext({})

export const BurgerMenuProvider = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isBurgerVisible, setIsBurgerVisible] = useState(true)

  const value = {
    isMenuOpen,
    setIsMenuOpen,
    isBurgerVisible,
    setIsBurgerVisible,
  }

  return (
    <BurgerMenuContext.Provider value={value}>
      {children}
    </BurgerMenuContext.Provider>
  )
}
