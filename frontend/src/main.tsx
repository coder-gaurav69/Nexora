
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { GlobalProvider } from './ContextApi/GlobalVariables.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <GlobalProvider>
      < App />
    </GlobalProvider>
  </BrowserRouter>
)
