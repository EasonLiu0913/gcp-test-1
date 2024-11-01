import React, {
  useState,
  useEffect,
  useCallback,
  memo,
} from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'
import { DEFAULT_SIZES } from 'config/style'

const Toggle = ({
  checkedIcon,
  className,
  color = 'primary',
  disabled = false,
  icon,
  id,
  keepColor = false,
  label,
  name,
  onChange = () => {},
  register,
  size = 'sm',
  styleName = '',
  uncheckedIcon,
  value,
}) => {

  // handle if used with react hook form
  const [toggleValue, setToggleValue] = useState(false)
  const [registerOptions, setRegisterOptions] = useState({})

  const handleClick = (e) => {
    const inputDom = e.currentTarget.querySelector('input')
    if (inputDom !== null) inputDom.click()
  }

  const handleValid = useCallback((e) => {
    if (disabled) return

    onChange(e.target.checked, name)
    // with react hook form
    if (typeof register == 'function') {
      setToggleValue(e.target.checked)
    }
  }, [])

  useEffect(() => {
    if (value === void 0) return
    setToggleValue(value)
  }, [value])

  // with react hook form
  useEffect(() => {
    if (typeof register !== 'function') return

    setRegisterOptions(register(name, {
      onChange: handleValid,
      setValueAs: (val) => {
        setToggleValue(val) // setting default value
        return val
      },
    }))
  }, [
    name,
    register,
    handleValid,
  ])

  const toggleSize = Object.keys(DEFAULT_SIZES).includes(size) ? size : 'sm'
  const toggleType = toggleValue ? 'truthy' : toggleValue === false ? 'falsy' : 'indet'
  const toggleIcon = (toggleValue ? checkedIcon : uncheckedIcon) || icon
  return (
    <section
      className={classReader(
        'toggle cursor-pointer no-outline no-wrap',
        { 'disabled no-pointer-events': disabled },
        className,
      )}
      id={id}
      name={name}
      onClick={handleClick}
    >
      <div
        className={classReader(
          { [`CommonStyle ${styleName}`]: 'toggle__inner' }, // can overwritten this className style
          `toggle__inner--${size}`,
          `toggle__inner--${toggleType}`,
          { [`text-${color}`]: keepColor || toggleValue },
        )}
      >
        <input
          className={classReader('hidden toggle__native')}
          type="checkbox"
          name={name}
          value={value}
          checked={toggleValue || false}
          onChange={handleValid}
          {...registerOptions}
        />

        <div className={classReader('toggle__track')} />

        <div className={classReader('toggle__thumb no-wrap')}>
          {Boolean(toggleIcon) && (
            <span className={classReader('toggle__thumb-icon')}>
              <i className={
                classReader(
                  `icon icon-${toggleIcon} icon-${toggleSize}`,
                  { [`icon-${color}`]: keepColor && toggleValue === false },
                  { 'icon-white': toggleValue },
                )}
              />
            </span>
          )}
        </div>
      </div>

      {Boolean(label) && (
        // can overwritten this className style
        <div className={classReader({ [`CommonStyle ${styleName}`]: 'toggle__label' }, `text-${toggleSize}`)}>
          {label}
        </div>
      )}
    </section>
  )
}

Toggle.propTypes = {
  checkedIcon: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.string,
  id: PropTypes.string,
  keepColor: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  register: PropTypes.func, // with react-hook form
  size: PropTypes.oneOf([
    'sm',
    'md',
    'lg',
    'xl',
  ]),
  styleName: PropTypes.string,
  uncheckedIcon: PropTypes.string,
  value: PropTypes.bool,
}

export default memo(Toggle)
