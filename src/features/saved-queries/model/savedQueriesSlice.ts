import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SavedQuery {
  id: string;
  name: string;
  query: string;
  order?: string;
  maxResults?: number;
  userId: string;
}

interface SavedQueriesState {
  queries: SavedQuery[];
}

const getInitialState = (): SavedQueriesState => {
  if (typeof window === 'undefined') {
    return { queries: [] }
  }

  try {
    const currentUserStr = localStorage.getItem('currentUser')

    if (!currentUserStr) {
      return { queries: [] }
    }

    const currentUser = JSON.parse(currentUserStr)

    const usersStr = localStorage.getItem('users')

    if (!usersStr) {
      return { queries: [] }
    }

    const users = JSON.parse(usersStr)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = users.find((u: any) => u.id === currentUser.id)

    return {
      queries: user?.saved_queries || [],
    }
  } catch (error) {
    console.error('Error loading saved queries from user data:', error)

    return { queries: [] }
  }
}

const saveToLocalStorage = (queries: SavedQuery[]) => {
  try {
    const currentUserStr = localStorage.getItem('currentUser')
    const usersStr = localStorage.getItem('users')

    if (currentUserStr && usersStr) {
      const currentUser = JSON.parse(currentUserStr)
      const users = JSON.parse(usersStr)

      const updatedCurrentUser = {
        ...currentUser,
        saved_queries: queries,
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updatedUsers = users.map((user: any) => user.id === currentUser.id
        ? updatedCurrentUser
        : user,
      )

      localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser))
      localStorage.setItem('users', JSON.stringify(updatedUsers))

    }
  } catch (error) {
    console.error('Error saving queries to user data:', error)
  }
}

const savedQueriesSlice = createSlice({
  name: 'savedQueries',
  initialState: getInitialState(),
  reducers: {
    addQuery: (state, action: PayloadAction<Omit<SavedQuery, 'id'>>) => {
      const newQuery: SavedQuery = {
        ...action.payload,
        id: Date.now().toString(),
      }

      state.queries.push(newQuery)
      saveToLocalStorage(state.queries)
    },

    updateQuery: (state, action: PayloadAction<SavedQuery>) => {
      const index = state.queries.findIndex(q => q.id === action.payload.id)

      if (index !== -1) {
        state.queries[index] = action.payload
        saveToLocalStorage(state.queries)
      }
    },

    deleteQuery: (state, action: PayloadAction<string>) => {
      state.queries = state.queries.filter(q => q.id !== action.payload)
      saveToLocalStorage(state.queries)
    },

    loadQueries: (state) => {
      const savedQueries = getInitialState()

      state.queries = savedQueries.queries
    },

    clearQueries: (state) => {
      state.queries = []
    },
  },
})

export const {
  addQuery,
  updateQuery,
  deleteQuery,
  loadQueries,
  clearQueries,
} = savedQueriesSlice.actions

export default savedQueriesSlice.reducer