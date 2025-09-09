import { useAppDispatch } from '@/app/store/store.hooks'
import React, { useEffect } from 'react'
import { loadCurrentUser } from '../user/model/authSlice'

export const AuthInitializer: React.FC = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(loadCurrentUser())
  }, [dispatch])

  return null
}