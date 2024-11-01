import React from 'react'
import MuiStepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import classReader from 'utils/classReader'
import { selectStep } from 'slices/stepperSlice'
import { useSelector } from 'react-redux'
import { STEPS_BATCH } from 'config/shortener'

const Stepper = () => {
  const stepNum = useSelector(selectStep)
  
  return <div className={classReader({ ShortenerStyle: 'stepper' })}>
    <MuiStepper activeStep={stepNum} alternativeLabel>
      {STEPS_BATCH.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </MuiStepper>
  </div>
}

export default Stepper