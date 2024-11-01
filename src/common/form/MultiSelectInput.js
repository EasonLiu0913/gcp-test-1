import React, {
  useState,
  useEffect,
  memo, useCallback,
} from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'
import { Controller } from 'react-hook-form'

const MultiSelectInputController = (props) => {
  const { 
    name,
    control,
    validate,
  } = props
  return <Controller
    name={name}
    control={control}
    rules={{ validate }}
    render={({ field, fieldState: { error } }) => <>
      <MultiSelectInput {...props} value={field.value} onChange={field.onChange} controllerError={error?.message}/>
    </>}
  />
}

const MultiSelectInput = ({
  className,
  controllerError,
  dense = false,
  disabled = false,
  hint,
  id,
  innerColor = 'white',
  invalidMsgPosition = 'right',
  name,
  placeholder,
  readonly = false,
  rounded = false,
  size = 'md',
  styleName = '',
  type = 'text',
  onChange,
  getValues = () => {},
  setTagsFromUserClick = () => {},
  value = [],
}) => {
  const [isFocus, setIsFocus] = useState(false)
  const [invalidMsg, setInvalidMsg] = useState('')
  const [inputTimer, setInputTimer] = useState(null)

  const autoCompleteInputOnChange = (
    input, newValue, delay = 0,
  ) => {
    const trimedValue = newValue.trim()
    if (!value.includes(trimedValue) && trimedValue !== ''){
      onChange([...value, trimedValue])
      setTagsFromUserClick([...value, trimedValue])
      setInvalidMsg('')
    }
    
    setTimeout(() => {
      input.value = ''
    }, delay)
  }

  const handleKeyDown = (e) => {
    const newValue = e.target.value
    const key = e.key
    if (key === 'Enter' && newValue) {
      autoCompleteInputOnChange(
        e.target, newValue, 0,
      )
    }
  }

  const handleChange = (e) => {
    // 暫時關閉自動新增標籤功能
    // const newValue = e.target.value
    // if (inputTimer) clearTimeout(inputTimer)
    // setInputTimer(setTimeout(() => {
    //   autoCompleteInputOnChange(
    //     e.target, newValue, 0,
    //   )
    // }, 800))
  }

  const handleBlur = useCallback((e) => {
    if (readonly) return
    if (readonly) return
    setIsFocus(false)
  }, [])

  const handleFocus = () => {
    if (readonly) return
    setIsFocus(true)
  }

  const handleDeleteTag = (key) => {
    const { tags = [] } = getValues() || {}
    onChange([...tags.slice(0, key), ...tags.slice(key + 1)])
    setTagsFromUserClick([...tags.slice(0, key), ...tags.slice(key + 1)])
    
  }

  useEffect(() => {
    setInvalidMsg(controllerError)
  }, [controllerError])

  return (
    <div className={classReader('multi-select-input')}>
      <div className={classReader('tag-list')}>
        {
          value.map( (item, index) => <div
            key={index}
            className={classReader('text-tag text-primary')}>
            {item}
            <i
              className={classReader('icon icon-close ml-1 text-tag-delete')}
              onClick={() => handleDeleteTag(index)}
            />
          </div> )
        }
      </div>
      <section
        className={
          classReader(
            'input field--outlined no-wrap',
            { [`CommonStyle ${styleName}`]: 'field--with-bottom' }, // can overwritten this className style
            { 'field--highlighted': isFocus },
            { 'field--invalidMsg': Boolean(invalidMsg) },
            { 'field--dense': dense },
            { 'field--rounded': rounded },
            { 'field--disabled': disabled },
            { 'field--readonly': readonly },
            { 'pure': className },
          )}
        id={id}
      >
        <div className={classReader('field__inner relative-position col p-0')}>
          <div
            className={classReader(
              'relative-position d-flex no-wrap',
              { [`CommonStyle ${styleName}`]: 'field__control' }, // can overwritten this className style
              { 'text-red': Boolean(invalidMsg) },
              { [`bg-${innerColor}`]: Boolean(innerColor) },
              { 'lg-input': size === 'lg' },
            )}
            tabIndex="-1"
          >

            <div className={classReader('field__control-container col relative-position d-flex no-wrap p-0')}>

              <input
                className={classReader('field__native q-placeholder')}
                tabIndex="0"
                name={name}
                type={type}
                placeholder={placeholder || ''}
                disabled={disabled}
                readOnly={readonly}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>
          </div>

          {(Boolean(invalidMsg || hint)) && (
            <div className={classReader('field__bottom field__bottom--animated d-flex align-items-flex-start',
              { 'field__bottom--invalid': Boolean(invalidMsg) })}
            >
              <div className={classReader('field__messages col p-0 pt-1',
                { 'text-right': invalidMsgPosition === 'right' })}>{invalidMsg || hint}</div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

MultiSelectInput.propTypes = {
  className: PropTypes.string,
  control: PropTypes.object.isRequired,
  controllerError: PropTypes.string,
  dense: PropTypes.bool,
  disabled: PropTypes.bool,
  hint: PropTypes.string,
  id: PropTypes.string,
  innerColor: PropTypes.string,
  invalidMsgPosition: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  readonly: PropTypes.bool,
  rounded: PropTypes.bool,
  size: PropTypes.string,
  styleName: PropTypes.string,
  type: PropTypes.oneOf([
    'email',
    'number',
    'password',
    'tel',
    'text',
  ]),
  validate: PropTypes.object,
  value: PropTypes.array,
}

export default memo(MultiSelectInputController)