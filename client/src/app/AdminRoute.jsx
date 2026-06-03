import { useAuthStore } from '@/app/store'
import { Navigate } from 'react-router-dom'

const AdminRoute = ({ children }) => {
  const { isAuthenticated, role } = useAuthStore()

  if (!isAuthenticated || role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute
