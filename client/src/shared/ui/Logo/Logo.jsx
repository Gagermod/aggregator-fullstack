import { Link } from 'react-router-dom'
import styles from './Logo.module.scss'

const Logo = (props) => {
  const { loading = 'lazy', children } = props

  const title = 'Home'

  return (
    <Link
      className={styles.logo}
      to="/"
      title={title}
      aria-label={title}
    >
      <img
        src={`${import.meta.env.BASE_URL}logo.svg`}
        alt=""
        width={30} height={30}
        loading={loading}
      />
      {children && <span className={styles.logoSign}>{children}</span>}
    </Link>
  )
}

export default Logo
