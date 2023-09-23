import { configureStore } from '@reduxjs/toolkit'
import { useSelector, TypedUseSelectorHook, useDispatch } from 'react-redux'
import { conversionResult } from './slices/conversionResult'

export const store = configureStore({
  reducer: {
    conversionResult
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch: () => AppDispatch = useDispatch
