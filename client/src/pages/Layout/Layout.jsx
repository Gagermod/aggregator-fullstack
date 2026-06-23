import { Outlet } from 'react-router-dom'
import Footer from '@/widgets/Footer'
import Header from '@/widgets/Header'
import styles from './Layout.module.scss'

const Layout = () => {
  return (
    <div className={styles.Layout}>
      <Header />
      <main className={styles.contentWrapper}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
