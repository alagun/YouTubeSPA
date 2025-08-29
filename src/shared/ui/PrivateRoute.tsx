import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../app/store/store.hooks'

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)

  return isAuthenticated ? <>{children}</> : <Navigate to='/login' replace />
}