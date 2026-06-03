import { createBrowserRouter } from 'react-router-dom'
import Admin from '@/pages/Admin'
import Aggregator from '@/pages/Aggregator'
import Layout from '@/pages/Layout'
import Suggest from '@/pages/Suggest'
import AdminRoute from './AdminRoute'
import ProtectedRoute from './ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Aggregator />,
      },
      {
        path: 'admin',
        element: (
          <AdminRoute>
            <Admin />
          </AdminRoute>
        ),
      },
      {
        path: 'suggest',
        element: (
          <ProtectedRoute>
            <Suggest />
          </ProtectedRoute>
        ),
      },
    ],
  },
])
