import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user
      localStorage.setItem('access_token', action.payload.access_token)
      localStorage.setItem('refresh_token', action.payload.refresh_token)
    },
    logout: (state, action) => {
      state.user = null
      localStorage.clear('access_token')
      localStorage.clear('refresh_token')
    },
  },
})

export const { login, logout } = userSlice.actions
export default userSlice.reducer
