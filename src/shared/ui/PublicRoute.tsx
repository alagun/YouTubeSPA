import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Spin } from 'antd'
import { useAppSelector } from '../../app/store/store.hooks'

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const location = useLocation()
  const { isAuthenticated, isLoading } = useAppSelector(state => state.auth)

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
        <Spin size='large' />
      </div>
    )
  }

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/'

    return <Navigate to={from} replace />
  }

  return <>{children}</>
}