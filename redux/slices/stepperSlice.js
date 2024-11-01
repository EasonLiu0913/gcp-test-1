import { createSlice } from '@reduxjs/toolkit'

const initial = { step: 0 }

export const stepperSlice = createSlice({
  name: 'stepper',
  initialState: initial,
  reducers: {
    nextStep(state) {
      state.step++
    },
    prevStep(state) {
      state.step--
    },
    reset() {
      return initial
    },
  },
})


export const selectStep = (state) => state.stepper.step
export const {
  nextStep,
  prevStep,
  reset,
} = stepperSlice.actions
export default stepperSlice.reducer