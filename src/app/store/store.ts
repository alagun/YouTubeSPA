import { configureStore } from '@reduxjs/toolkit'
import { authApi } from '../../shared/api/authApi'
import { youtubeApi } from '../../shared/api/youtubeApi'
import authSlice from '../../entities/user/model/authSlice'
import searchSlice from '../../features/search/model/searchSlice'
import savedQueriesSlice from '@/features/saved-queries/model/savedQueriesSlice'

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [youtubeApi.reducerPath]: youtubeApi.reducer,
    auth: authSlice,
    search: searchSlice,
    savedQueries: savedQueriesSlice,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['persist/PERSIST'],
    },
  }).concat(
    authApi.middleware,
    youtubeApi.middleware,
  ),
})
