import 'react-toastify/dist/ReactToastify.css'
import './app/styles'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import App from './app/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ToastContainer
      position='bottom-left'
      autoClose={5000}
      theme='colored'
    />
  </StrictMode>
)
