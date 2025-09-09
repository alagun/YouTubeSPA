import { SavedQuery } from '@/features/saved-queries'
import { createSlice, type PayloadAction, current } from '@reduxjs/toolkit'

export interface IUser {
  id: string;
  username: string;
  email: string;
  age: number;
  gender: string;
  isAuth: boolean;
  saved_queries?: SavedQuery[];
}

interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  users: IUser[];
}

const loadUsersFromStorage = (): IUser[] => {
  try {
    const usersStr = localStorage.getItem('users')

    return usersStr ? JSON.parse(usersStr) : []
  } catch (error) {
    console.error('Error loading users from localStorage:', error)

    return []
  }
}

const saveUsersToStorage = (users: IUser[]) => {
  try {
    localStorage.setItem('users', JSON.stringify(users))
  } catch (error) {
    console.error('Error saving users to localStorage:', error)
  }
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  users: loadUsersFromStorage(),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: IUser; token: string }>) => {
      const existingUserIndex = state.users.findIndex(u => u.id === action.payload.user.id)

      let savedQueries: SavedQuery[] = []

      if (existingUserIndex !== -1) {
        savedQueries = state.users[existingUserIndex].saved_queries || []
      }

      const userWithAuth = {
        ...action.payload.user,
        isAuth: true,
        saved_queries: savedQueries,
      }

      state.user = userWithAuth
      state.token = action.payload.token
      state.isAuthenticated = true
      state.isLoading = false

      if (existingUserIndex !== -1) {
        state.users[existingUserIndex] = userWithAuth
      } else {
        state.users.push(userWithAuth)
      }

      localStorage.setItem('token', action.payload.token)
      saveUsersToStorage(state.users)
      localStorage.setItem('currentUser', JSON.stringify(userWithAuth))
    },

    logout: (state) => {

      if (state.user) {
        const userIndex = state.users.findIndex(u => u.id === state.user!.id)

        if (userIndex !== -1) {
          state.users[userIndex] = {
            ...state.users[userIndex],
            isAuth: false,
          }
          saveUsersToStorage(current(state.users))
        }
      }

      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isLoading = false

      localStorage.removeItem('token')
      localStorage.removeItem('currentUser')
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    setUserData: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload

      const userIndex = state.users.findIndex(u => u.id === action.payload.id)

      if (userIndex !== -1) {
        state.users[userIndex] = action.payload
        saveUsersToStorage(state.users)
      }

      localStorage.setItem('currentUser', JSON.stringify(action.payload))
    },

    updateUserSavedQueries: (state, action: PayloadAction<{ userId: string; saved_queries: SavedQuery[] }>) => {
      const { userId, saved_queries } = action.payload
      const userIndex = state.users.findIndex(u => u.id === userId)

      if (userIndex !== -1) {
        state.users[userIndex] = { ...state.users[userIndex], saved_queries }
        saveUsersToStorage(state.users)

        if (state.user && state.user.id === userId) {
          state.user = { ...state.user, saved_queries }
          localStorage.setItem('currentUser', JSON.stringify(state.user))
        }
      }
    },

    loadCurrentUser: (state) => {
      try {
        const currentUserStr = localStorage.getItem('currentUser')
        const token = localStorage.getItem('token')

        if (currentUserStr && token) {
          const currentUser = JSON.parse(currentUserStr)

          state.user = currentUser
          state.token = token
          state.isAuthenticated = true

          const usersStr = localStorage.getItem('users')

          if (usersStr) {
            state.users = JSON.parse(usersStr)
          }
        }
      } catch (error) {
        console.error('Error loading current user from localStorage:', error)
      }
    },
    switchUser: (state, action: PayloadAction<IUser>) => {
      const userWithAuth = { ...action.payload, isAuth: true }

      state.user = userWithAuth
      state.isAuthenticated = true

      localStorage.setItem('currentUser', JSON.stringify(userWithAuth))

      const updatedUsers = state.users.map(user => user.id === userWithAuth.id
        ? userWithAuth
        : { ...user, isAuth: false },
      )

      state.users = updatedUsers
      saveUsersToStorage(updatedUsers)
    },
  },
})

export const {
  setCredentials,
  logout,
  setLoading,
  setUserData,
  updateUserSavedQueries,
  loadCurrentUser,
} = authSlice.actions

export default authSlice.reducer