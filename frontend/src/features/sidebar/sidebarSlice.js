import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarShow: true,
}

const userSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    closeopen: (state) => {
      state.sidebarShow = !state.sidebarShow
    },
  },
})

export const { login, logout } = userSlice.actions
export default userSlice.reducer
