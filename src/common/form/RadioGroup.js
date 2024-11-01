import React, {
  useState,
  useEffect,
  useCallback,
  memo,
} from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'

const RadioGroup = ({
  className,
  disabled = false,
  id,
  isCheckStyle = false,
  keepColor = false,
  name,
  onChange = () => {},
  options,
  readonly = false,
  register = () => {},
  row = false,
  selection,
}) => {

  // handle if used with react hook form
  const [selectionValue, setSelectionValue] = useState('')

  const handleClick = (e) => {
    e.stopPropagation()

    const inputDom = e.currentTarget.querySelector('input')
    if (inputDom !== null) inputDom.click()
  }

  const handleValid = useCallback((e) => {
    if (readonly || disabled) return
    onChange(e.target.value, name)

    // with react hook form
    if (typeof register == 'function') {
      setSelectionValue(e.target.value)
    }
  }, [])

  useEffect(() => {
    if (selection === void 0) return
    setSelectionValue(selection)
  }, [selection])

  return (
    <>
      {options?.map((option, index) => {
        const isActive = option.value === selectionValue
        const optionColor = option.color || 'primary'
        return (
          <div
            key={index}
            className={classReader(
              'radio no-outline no-wrap',
              { 'd-flex': row },
              { 'disabled': disabled },
              { 'radio--readonly': readonly },
              className,
            )}
            onClick={handleClick}
          >
            <div className={classReader('radio__inner relative-position', { [`text-${optionColor}`]: Boolean(optionColor) && (keepColor || isActive) })} >
              <input
                className={classReader('hidden radio__native')}
                type="radio"
                name={name}
                value={option.value}
                checked={isActive}
                onChange={handleValid}
                {...register(name, {
                  onChange: handleValid,
                  setValueAs: (val) => {
                    setSelectionValue(val) // setting default value
                    return val
                  },
                })}
              />
              <span className={classReader('radio__icon', { isCheckStyle })} data-active={isActive} />
            </div>
            <div className={classReader('radio__label')}>
              {option.label}
            </div>
          </div>
        )
      })}
    </>
  )
}

RadioGroup.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  isCheckStyle: PropTypes.bool,
  keepColor: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.array,
  readonly: PropTypes.bool,
  register: PropTypes.func, // with react-hook form
  row: PropTypes.bool,
  selection: PropTypes.string,
}

export default RadioGroup