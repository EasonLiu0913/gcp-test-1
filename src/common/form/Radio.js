import React, {
  useState,
  useEffect,
  useCallback,
  memo,
} from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'

const Radio = ({
  className,
  color,
  disabled = false,
  id,
  isCheckStyle = false,
  keepColor = false,
  label,
  name,
  onChange = () => {},
  readonly = false,
  register,
  row = false,
  selection,
  value,  
}) => {

  // handle if used with react hook form
  const [selectionValue, setSelectionValue] = useState('')
  const [registerOptions, setRegisterOptions] = useState({})

  const handleClick = (e) => {
    e.stopPropagation()

    const inputDom = e.currentTarget.querySelector('input')
    if (inputDom !== null) inputDom.click()
  }

  const handleValid = useCallback((e) => {
    if (readonly || disabled) return
    onChange(e.target.value, name)

    // with react hook form
    if (typeof register === 'function') {
      setSelectionValue(e.target.value)
    }
  }, [])

  useEffect(() => {
    if (selection === void 0) return
    setSelectionValue(selection)
  }, [selection])

  // with react hook form
  useEffect(() => {
    if (typeof register !== 'function') return

    setRegisterOptions(register(name, {
      onChange: handleValid,
      setValueAs: (val) => {
        setSelectionValue(val) // setting default value
        return val
      },
    }))
  }, [
    name,
    register,
    handleValid,
  ])

  const isActive = selectionValue === value
  return (
    <div
      className={classReader(
        'radio no-outline no-wrap',
        { 'd-flex': row },
        { 'disabled': disabled },
        { 'radio--readonly': readonly },
        className,
      )}
      id={id}
      onClick={handleClick}
    >
      <div
        className={classReader('radio__inner relative-position',
          { [`${color}`]: Boolean(color) && (keepColor || isActive) })}
      >
        <input
          className={classReader('hidden radio__native')}
          type="radio"
          name={name}
          value={value}
          checked={isActive}
          onChange={handleValid}
          {...registerOptions}
        />
        <span className={classReader('radio__icon', { isCheckStyle })} data-active={isActive} />
      </div>

      {Boolean(label) && (
        <div className={classReader('radio__label')}>
          {label}
        </div>
      )}
    </div>
  )
}

Radio.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  isCheckStyle: PropTypes.bool,
  keepColor: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  readonly: PropTypes.bool,
  register: PropTypes.func,
  row: PropTypes.bool,
  selection: PropTypes.string,
  value: PropTypes.string, 
}

export default memo(Radio)