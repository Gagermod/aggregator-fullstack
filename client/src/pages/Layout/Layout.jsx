import { Outlet, useLocation } from 'react-router-dom'
import Footer from '@/widgets/Footer'
import Header from '@/widgets/Header'
import styles from './Layout.module.scss'

const Layout = () => {
  const location = useLocation()
  const isAdminPage = location.pathname === '/admin'

  return (
    <div className={styles.Layout}>
      <Header />
      <main
        className={`${styles.contentWrapper} ${
          isAdminPage ? styles.adminLayout : ''
        }`}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
