import { configureStore } from '@reduxjs/toolkit'
import loadingReducer from 'slices/loadingSlice'
import alertSlice from 'slices/alertSlice'
import stepperReducer from 'slices/stepperSlice'
import userReducer from 'slices/userSlice'

const store = configureStore({
  reducer: {
    loading: loadingReducer,
    alert: alertSlice,
    stepper: stepperReducer,
    user: userReducer,
  },
})

export default store