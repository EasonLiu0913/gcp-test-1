import React, {
  useState,
  useEffect,
  useCallback,
} from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'
import Button from 'common/Button'

const Textarea = ({
  appendChild,
  className,
  clearable = false,
  color = 'primary',
  controllerError,
  counter = false,
  dense = false,
  disabled = false,
  hint,
  id,
  innerColor = 'white',
  maxLength,
  name,
  onBlur = () => {},
  onChange = () => {},
  onFocus = () => {},
  onKeyDown = () => {},
  onValidate = () => {},
  placeholder,
  prependChild,
  readonly = false,
  register = () => {},
  resize = true,
  rounded = false,
  styleName = '',
  validate,
  value,
}) => {

  const [isFocus, setIsFocus] = useState(false)
  const [invalidMsg, setInvalidMsg] = useState('')

  const handleValid = (value) => {
    let invalidMsg = ''
    for (const property in validate) {
      const validFunc = validate[property]
      const validResult = validFunc(value)

      if (typeof validResult === 'string') {
        invalidMsg = validResult
        break
      }
    }

    setInvalidMsg(invalidMsg)
    onValidate(invalidMsg === '')
  }

  const handleChange = useCallback((e) => {
    const newValue = e.target.value
    handleValid(newValue)
    onChange(newValue, name)
  }, [])

  const handleKeyDown = (e) => {
    const newValue = e.target.value
    const key = e.key

    onKeyDown(
      key, newValue, name,
    )
  }

  const handleBlur = useCallback((e) => {
    if (readonly) return

    const newValue = e?.target?.value
    handleValid(newValue)
    onBlur(newValue, name)
    setIsFocus(false)
  }, [])

  const handleFocus = () => {
    if (readonly) return
    setIsFocus(true)
    onFocus()
  }

  const atClickReset = () => {
    handleValid('')
    onChange('', name)
  }

  useEffect(() => {
    setInvalidMsg(controllerError)
  }, [controllerError])


  const isShowClearButton = clearable && readonly === false && disabled === false && Boolean(value)
  return (
    <section
      className={
        classReader(
          'textarea field--outlined no-wrap',
          { [`CommonStyle ${styleName}`]: 'field--with-bottom' }, // can overwritten this className style
          { 'field--highlighted': Boolean(invalidMsg) || isFocus },
          { 'field--dense': dense },
          { 'field--rounded': rounded },
          { 'field--disabled': disabled },
          { 'field--readonly': readonly },
          { 'textarea--disable-resize': !resize },
          className,
        )}
      id={id}
    >
      <div className={classReader('field__inner relative-position col p-0')}>
        <div
          className={classReader(
            'relative-position d-flex no-wrap',
            { [`CommonStyle ${styleName}`]: 'field__control' }, // can overwritten this className style
            { 'red': Boolean(invalidMsg) },
            { [color]: Boolean(color) && invalidMsg === '' },
            { [`bg-${innerColor}`]: Boolean(innerColor) },
          )}
          tabIndex="-1"
        >
          {Boolean(prependChild) && (
            <div className={classReader('field__prepend field__marginal d-flex no-wrap align-items-center gray-9')}>
              {prependChild}
            </div>
          )}

          <div className={classReader('field__control-container col relative-position d-flex no-wrap p-0')}>
            <textarea
              className={classReader('field__native q-placeholder')}
              tabIndex="0"
              name={name}
              value={value}
              placeholder={placeholder || ''}
              maxLength={maxLength}
              disabled={disabled}
              readOnly={readonly}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              onFocus={handleFocus}
              autoComplete="off"
              {...register(name, {
                validate,
                onChange: handleChange,
                onBlur: handleBlur,
              })}
            />
          </div>

          {isShowClearButton && (
            <div className={classReader('field__append field__marginal d-flex no-wrap align-items-center')}>
              <Button
                className={classReader('field__clearable-action')}
                icon="stroke-close"
                color="gray-3"
                iconColor="white"
                size="sm"
                onClick={atClickReset}
                unelevated
                round
              />
            </div>
          )}

          {Boolean(appendChild) && (
            <div className={classReader('field__append field__marginal d-flex no-wrap align-items-center gray-7')}>
              {appendChild}
            </div>
          )}
        </div>

        {(Boolean(invalidMsg || hint) || counter) && (
          <div className={classReader('field__bottom field__bottom--animated d-flex align-items-flex-start',
            { 'field__bottom--invalid': Boolean(invalidMsg) })}
          >
            <div className={classReader('field__messages col p-0 text-right')}>{invalidMsg || hint}</div>
            {counter && (
              <div className={classReader('input__counter')}>
                {value?.length || 0} {Boolean(maxLength) && ` / ${maxLength}`}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

Textarea.propTypes = {
  appendChild: PropTypes.node,
  className: PropTypes.string,
  clearable: PropTypes.bool,
  color: PropTypes.string,
  controllerError: PropTypes.string,
  counter: PropTypes.bool,
  dense: PropTypes.bool,
  disabled: PropTypes.bool,
  hint: PropTypes.string,
  id: PropTypes.string,
  innerColor: PropTypes.string,
  maxLength: PropTypes.number,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
  onValidate: PropTypes.func,
  placeholder: PropTypes.string,
  prependChild: PropTypes.node,
  readonly: PropTypes.bool,
  register: PropTypes.func, // with react-hook form
  resize: PropTypes.bool,
  rounded: PropTypes.bool,
  styleName: PropTypes.string,
  validate: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),  
}

export default Textarea
