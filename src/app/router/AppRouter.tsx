import { createBrowserRouter } from 'react-router-dom'
import { PrivateRoute } from '../../shared/ui/PrivateRoute'
import { SavedQueriesPage } from '@/pages/saved'
import { AuthPage } from '@/pages/auth'
import { MainPage } from '@/pages/main'
import { NotFoundPage } from '@/pages/not-found'
import { RegistrationPage } from '@/pages/registration'
import App from '../App'

export const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <MainPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'login',
        element: <AuthPage />,
      },
      {
        path: 'registration',
        element: <RegistrationPage />,
      },
      {
        path: 'main',
        element: (
          <PrivateRoute>
            <MainPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'saved',
        element: (
          <PrivateRoute>
            <SavedQueriesPage />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
],
{
  basename: import.meta.env.BASE_URL,
})