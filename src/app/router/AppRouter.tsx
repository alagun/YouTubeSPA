import { createBrowserRouter } from 'react-router-dom'
import { MainPage } from '../../pages/main/ui/MainPage'
import { AuthPage } from '../../pages/auth/ui/AuthPage'
import { PrivateRoute } from '../../shared/ui/PrivateRoute'
import { RegistrationPage } from '../../pages/registration/ui/RegistrationPage'
import { NotFoundPage } from '../../pages/not-found'
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