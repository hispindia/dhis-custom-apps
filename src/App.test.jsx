import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'



createRoot(document.getElementById('root')).render(
  <StrictMode>
  
   <React.Suspense fallback="Loading...">

    <App />

   </React.Suspense>
   
  </StrictMode>
)
