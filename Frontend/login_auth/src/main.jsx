import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { GroupProvider } from '../Context/GroupContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GroupProvider>
      <App />
    </GroupProvider>
  </StrictMode>,
)
