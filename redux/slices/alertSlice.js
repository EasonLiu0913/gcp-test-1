import { createSlice } from '@reduxjs/toolkit'

const initial = {
  status: '',
  code: '',
  message: '',
}

export const alertSlice = createSlice({
  name: 'alert',
  initialState: initial,
  reducers: {
    setAlertState(state, action) {
      state.status = action.payload.status
      state.code = action.payload.code
    },
    resetAlertState() {
      return initial
    },
  },
})


export const selectAlertStatus = (state) => state.alert.status
export const selectAlertCode = (state) => state.alert.code
export const selectAlertMessage = (state) => state.alert.message

export const { setAlertState, resetAlertState } = alertSlice.actions

export default alertSlice.reducer