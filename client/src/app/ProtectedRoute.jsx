import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/app/store'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to='/' replace />
  }

  return children
}

export default ProtectedRoute
