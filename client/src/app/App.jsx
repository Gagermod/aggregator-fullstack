import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { VisualEffectsProvider, BurgerMenuProvider } from '@/app/providers'
import { router } from '@/app/router'
import { useAuthStore } from '@/app/store'

const App = () => {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <>
      <VisualEffectsProvider />
      <BurgerMenuProvider>
        <RouterProvider router={router} />
      </BurgerMenuProvider>
    </>
  )
}

export default App
