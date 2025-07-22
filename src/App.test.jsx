import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'i18next';

createRoot(document.getElementById('root')).render(
  <StrictMode>
  
   <React.Suspense fallback="Loading...">

    <App />

   </React.Suspense>
   
  </StrictMode>
)
