import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store/store.hooks'
import { loadQueries, clearQueries } from '@/features/saved-queries/model/savedQueriesSlice'

export const UserQueriesLoader: React.FC = () => {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(state => state.auth.user)

  useEffect(() => {
    if (currentUser) {
      dispatch(loadQueries())
    } else {
      dispatch(clearQueries())
    }
  }, [dispatch, currentUser])

  return null
}