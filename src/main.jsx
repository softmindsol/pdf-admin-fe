import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ReduxProviderWrapper from './store/Provider'
import { Toaster } from 'sonner'
// import setupLocatorUI from "@locator/runtime";

  // setupLocatorUI();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
         <Toaster position="bottom-right" />

   <ReduxProviderWrapper>
    <App />
    </ReduxProviderWrapper> 
  </StrictMode>,
)
