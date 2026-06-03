import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/app/store'
import Checkbox from '@/shared/ui/Checkbox'
import styles from './Auth.module.scss'

const Auth = (props) => {
  const { isOpen, onClose } = props

  const [isLogin, setIsLogin] = useState(true)
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')

  const location = useLocation()
  const navigate = useNavigate()

  const {
    login,
    registration,
    isLoading,
    isAuthenticated,
    logout,
    role,
  } = useAuthStore()

  const registrationHandler = async (event) => {
    event.preventDefault()
    const result = await registration(nickname, password)

    if (result.success) {
      toast.success('Account has been created')
      setIsLogin(true)
    }
  }

  const loginHandler = async (event) => {
    event.preventDefault()
    const result = await login(nickname, password)

    if (result.success) {
      toast.success('Logged in successfully')
      onClose()
      setNickname('')
      setPassword('')
    }
  }

  const logoutHandler = () => {
    logout()
    toast.success('Logged out successfully')
    onClose()
    navigate('/')
  }

  const modalRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      const isAuthButton = e.target.closest('[data-auth-button="true"]')

      if (
        modalRef.current &&
        !modalRef.current.contains(e.target) &&
        !isAuthButton
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  if (isAuthenticated) {
    return (
      <div className={styles.logoutModal} ref={modalRef}>
        {role === 'admin' && (
          <Link to="/admin" className={styles.adminButton} onClick={onClose}>
            ADMIN
          </Link>
        )}
        {location.pathname === '/suggest' ? (
          <Link to="/" className={styles.mainButton} onClick={onClose}>
            MAIN
          </Link>
        ) : (
          <Link
            to="/suggest"
            className={styles.suggestButton}
            onClick={onClose}
          >
            SUGGEST
          </Link>
        )}
        <button className={styles.logoutButton} onClick={logoutHandler}>
          LOGOUT
        </button>
      </div>
    )
  }

  return (
    <div className={styles.auth} ref={modalRef}>
      <div className={styles.h2Container}>
        <h2>
          <span className={styles.sign}>$ </span>
          ./auth --
          <span className={styles.flag}>
            {isLogin ? 'login' : 'register'}
          </span>
        </h2>
      </div>
      <form
        className={styles.form}
        onSubmit={isLogin ? loginHandler : registrationHandler}
      >
        <input
          className={styles.input}
          type='text'
          placeholder='Nickname'
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          className={styles.input}
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className={styles.SubmitContainer}>
          <Checkbox
            id='loginInsteadCheckbox'
            name='Login instead'
            text='LOGIN_INSTEAD'
            checked={isLogin}
            onChange={() => setIsLogin(!isLogin)}
          />
          <button
            className={`${styles.submit} ${
              isLoading ? styles.disabled : ''
            }`}
            type='submit'
            disabled={isLoading}
          >
            SUBMIT
          </button>
        </div>
      </form>
    </div>
  )
}

export default Auth
