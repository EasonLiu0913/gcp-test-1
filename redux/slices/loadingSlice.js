import { createSlice } from '@reduxjs/toolkit'

const loadingInitial = {
  loadingCount: 0,
  isLoading: false,
  loadingText: '',
}

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: loadingInitial,
  reducers: {
    setLoadingTextState(state, action) {
      state.loadingText = action.payload
    },
    openLoading(state) {
      if (state.isLoading === false) {
        state.isLoading = true
      }
      state.loadingCount++
    },
    closeLoading(state) {
      if (state.loadingCount - 1 <= 0) {
        state.isLoading = false
      }
      state.loadingCount--
    },
  },
})

export const selectIsLoading = (state) => state.loading.isLoading
export const selectLoadingText = (state) => state.loading.loadingText
export default loadingSlice.reducer