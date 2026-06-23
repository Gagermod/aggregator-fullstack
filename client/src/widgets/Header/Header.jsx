import { useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { BurgerMenuContext } from '@/app/providers/BurgerMenuProvider'
import { useAuthStore } from '@/app/store'
import Auth from '@/features/authenticate'
import BurgerButton from '@/shared/ui/BurgerButton'
import Logo from '@/shared/ui/Logo'
import styles from './Header.module.scss'

const Header = () => {
  const { isMenuOpen, setIsMenuOpen, isBurgerVisible } =
    useContext(BurgerMenuContext)
  const [isVisibleModal, setIsVisibleModal] = useState(false)
  const { user, isAuthenticated } = useAuthStore()
  const location = useLocation()

  const isHomePage = location.pathname === '/'

  return (
    <>
      <header className={styles.header}>
        <div className={`${styles.container}`}>
          <Logo loading='eager'>
            <div className={styles.decor} aria-hidden={true}>
              #!/usr/bin/env
            </div>
            <h1 className='h1'>OpinionHub</h1>
          </Logo>
          <div className={`${styles.container}`}>
            <button
              className={styles.AuthButton}
              onClick={(e) => {
                e.stopPropagation()
                setIsVisibleModal(!isVisibleModal)
              }}
              data-auth-button='true'
            >
              {isAuthenticated ? user?.login || 'Profile' : 'Auth'}
            </button>
            <Auth
              isOpen={isVisibleModal}
              onClose={() => setIsVisibleModal(false)}
            />
            <span className='hidden-mobile'>v1.0.0</span>
            {isHomePage && isBurgerVisible && (
              <BurgerButton
                className='visible-tablet'
                isActive={isMenuOpen}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />
            )}
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
