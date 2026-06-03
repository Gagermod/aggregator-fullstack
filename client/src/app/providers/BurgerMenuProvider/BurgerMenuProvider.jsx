import { createContext, useState } from 'react'

export const BurgerMenuContext = createContext({})

export const BurgerMenuProvider = (props) => {
  const { children } = props

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <BurgerMenuContext.Provider value={{ isMenuOpen, setIsMenuOpen }}>
      {children}
    </BurgerMenuContext.Provider>
  )
}
