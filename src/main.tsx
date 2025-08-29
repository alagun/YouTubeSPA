import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { AppRouter } from './app/router/AppRouter'
import { Provider } from 'react-redux'
import { store } from './app/store/store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store= {store}>
      <RouterProvider router={AppRouter} />
    </Provider>
  </StrictMode>,
)
