import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SearchState {
  query: string;
  maxResults?: number;
  order?: string;
  currentPage: number;
  pageTokens: {
    [key: number]: string;
  };
}

const initialState: SearchState = {
  query: '',
  maxResults: 12,
  order: 'relevance',
  currentPage: 1,
  pageTokens: {},
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload
      state.currentPage = 1
      state.pageTokens = {}
    },

    setSearchParams: (state, action: PayloadAction<{
      maxResults?: number;
      order?: string;
    }>) => {
      if (action.payload.maxResults !== undefined) {
        state.maxResults = action.payload.maxResults
      }

      if (action.payload.order !== undefined) {
        state.order = action.payload.order
      }
    },

    clearSearch: (state) => {
      state.query = ''
      state.currentPage = 1
      state.pageTokens = {}
      state.maxResults = 12
      state.order = 'relevance'
    },

    setPageToken: (state, action: PayloadAction<{ page: number; token: string }>) => {
      state.pageTokens[action.payload.page] = action.payload.token
    },

    goToNextPage: (state) => {
      state.currentPage += 1
    },

    goToPrevPage: (state) => {
      state.currentPage = Math.max(1, state.currentPage - 1)
    },
  },
})

export const {
  setSearchQuery,
  setSearchParams,
  clearSearch,
  setPageToken,
  goToNextPage,
  goToPrevPage,
} = searchSlice.actions

export default searchSlice.reducer