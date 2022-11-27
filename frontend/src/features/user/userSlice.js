import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  access_token: '',
  refresh_token: '',
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user
      state.access_token = action.payload.access
      state.refresh_token = action.payload.refresh
    },
    logout: (state, action) => {
      state.user = null
      state.access_token = ''
      state.refresh_token = ''
    },
  },
})

export const { login, logout } = userSlice.actions
export default userSlice.reducer
