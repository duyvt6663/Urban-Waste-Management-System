import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarShow: true,
}

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    closeopen: (state) => {
      state.sidebarShow = !state.sidebarShow
    },
  },
})

export const { closeopen } = sidebarSlice.actions
export default sidebarSlice.reducer
