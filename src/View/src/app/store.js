import { configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'
import userReducer from '../features/user/userSlice'
import sidebarReducer from '../features/sidebar/sidebarSlice'
import thunk from 'redux-thunk'
import { persistReducer } from 'redux-persist'

const reducers = combineReducers({
  user: userReducer,
  sidebar: sidebarReducer,
})

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
})
