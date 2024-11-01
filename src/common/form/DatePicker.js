import React, {
  useCallback, forwardRef, useEffect, useState,
} from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers'
import { Controller } from 'react-hook-form'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'
import {
  DATE_FORMAT, MAX_DATE, MIN_DATE, 
} from 'config/date'

const DatePickerController = ({
  name,
  control,
  validate,
}) => {

  return <Controller
    name={name}
    control={control}
    rules={{ validate }}
    render={({ field, fieldState: { error } }) => <>
      <DatePicker errorMsg={error?.message} {...field} {...{
        name,
        control,
        validate,
      }}/>
    </>}
  />
}

const DatePicker = forwardRef(({
  name = '',
  onChange,
  value = null,
  errorMsg,
  disabled = false,
  minDate = MIN_DATE,
  maxDate = MAX_DATE,
}, ref) => {
  const [invalidMsg, setInvalidMsg] = useState('')

  useEffect(() => {
    setInvalidMsg(errorMsg)
  }, [errorMsg])

  const handleChange = useCallback((data) => {
    setInvalidMsg('')
    onChange(dayjs(data?.$d), name)
  }, [])

  return <div className={classReader('date-picker', { 'is-error': Boolean(invalidMsg) })}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiDatePicker
        className={classReader('mb-0 pb-2')}
        format={DATE_FORMAT}
        onChange={handleChange}
        value={value ? dayjs(value).isAfter(minDate) ? dayjs(value) : dayjs(minDate) : null}
        ref={ref}
        disabled={disabled}
        // disableFuture
        minDate={dayjs(minDate)}
        maxDate={dayjs(maxDate)}
      />
    </LocalizationProvider>
    <div className={classReader('msg pt-1')}>{invalidMsg}</div>
  </div>
})

DatePicker.displayName = 'DatePicker'

DatePicker.propTypes = {
  name: PropTypes.string,
  control: PropTypes.object,
  errorMsg: PropTypes.string,
  validate: PropTypes.object,
  disabled: PropTypes.bool,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
}

export default DatePickerController