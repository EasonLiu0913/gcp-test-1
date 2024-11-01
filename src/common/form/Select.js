import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  memo,
} from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'

import { useWindowSize } from 'hooks/useWindowSize'

import Button from 'common/Button'

// https://github.com/react-component/overflow/issues/6
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const initialMenuStyle = {
  minWidth: '',
  marginTop: '',
  // top: '',
  // left: ''
}

const Select = ({
  appendChild,
  className,
  clearable = false,
  color = 'primary',
  controllerError = '',
  dense = false,
  disabled = false,
  hint,
  id,
  name,
  onChange = () => {},
  onValidate = () => {},
  options = [],
  optionsDense,
  placeholder = '',
  prependChild,
  readonly = false,
  register = () => {}, 
  rounded = false,
  styleName = '',
  validate,
  value,
}) => {

  const { windowWidthSize, windowHeightSize } = useWindowSize()
  const [selectedLabel, setSelectedLabel] = useState('')
  // handle if used with react hook form
  const [selectedValue, setSelectedValue] = useState('')

  const [invalidMsg, setInvalidMsg] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState(initialMenuStyle)
  const [focusedMenuItem, setFocusedMenuItem] = useState('')

  const menuRef = useRef(null)
  const controlRef = useRef(null)

  const toggleMenu = () => {
    if (readonly || disabled) return
    setIsMenuOpen(prev => !prev)
  }

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

  const handleChange = useCallback((item) => {
    handleValid(item.value)
    setSelectedValue(item.value)
    onChange(name, item.value)

    // with react hook form
    if (typeof register === 'function') {
      const inputDom = controlRef.current.querySelector('input')
      if (inputDom !== null) {
        inputDom.value = item.value
        // console.log(inputDom)
      }
    }

    setIsMenuOpen(false)
  }, [])

  const atClickReset = () => {
    handleValid('')
    setSelectedValue('')
    onChange(name, '')
  }

  // 依據畫面長寬變動，一同改變  Menu 位置
  useIsomorphicLayoutEffect(() => {
    if (isMenuOpen) {
      const controlWidth = controlRef.current?.offsetWidth || 0

      // FIXME: 選單位至 CSS 待修正
      setMenuStyle(prev => ({
        ...prev,
        minWidth: `${controlWidth}px`,
        marginTop: className?.includes('mb-0') ? '6px' : '-20px',
      }))
    }
  }, [
    windowWidthSize,
    windowHeightSize,
    isMenuOpen,
    className,
    dense,
  ])

  // 點擊元件外的範圍時，關閉 Menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current === null || controlRef.current === null) return

      const isClickSelectControl = controlRef.current.contains(event?.target)
      const isClickMenu = menuRef.current.contains(event?.target)
      if (isClickMenu === false && isClickSelectControl === false) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [name])

  useEffect(() => {
    if (value === void 0) return
    setSelectedValue(value)
  }, [value])

  useEffect(() => {
    const item = options.find(option => option.value === selectedValue)
    setSelectedLabel(item?.label || '')
  }, [selectedValue, options])

  useEffect(() => {
    setInvalidMsg(controllerError)
  }, [controllerError])

  const isShowClearButton = clearable && readonly === false && disabled === false && (Boolean(selectedValue) || selectedValue === 0)
  return (
    <section className={classReader('relative-position')}>
      <section
        ref={controlRef}
        className={
          classReader(
            'select no-wrap d-flex align-items-flex-start select--without-input field--outlined',
            { [`CommonStyle ${styleName}`]: 'field--with-bottom' }, // can overwritten this className style
            { 'field--highlighted': Boolean(invalidMsg) || isMenuOpen },
            { 'field--dense': dense },
            { 'field--rounded': rounded },
            { 'field--disabled': disabled },
            { 'field--readonly': readonly },
            className,
          )}
        id={id}
        onClick={toggleMenu}
      >
        <div className={classReader('field__inner relative-position col p-0')}>
          <div
            className={classReader(
              'relative-position d-flex no-wrap',
              { [`CommonStyle ${styleName}`]: 'field__control' }, // can overwritten this className style
              { 'red': Boolean(invalidMsg) },
              { [color]: Boolean(color) && invalidMsg === '' },
            )}
            tabIndex="-1"
          >
            {Boolean(prependChild) && (
              <div className={classReader('field__prepend field__marginal d-flex no-wrap align-items-center text-gray-9')}>
                {prependChild}
              </div>
            )}
            
            <div className={classReader('field__control-container col relative-position d-flex no-wrap p-0')}>
              <div className={classReader('field__native d-flex align-items-center')}>
                {Boolean(selectedValue) || selectedValue === false || selectedValue === 0
                  ? (<span className={classReader('select__value')}>{selectedLabel}</span>)
                  : (<span className={classReader('select__placeholder')}>{placeholder}</span>)
                }

                <input
                  className={classReader('select__focus-target')}
                  tabIndex="0"
                  {...register(name, {
                    validate,
                    setValueAs: (val) => {
                      setSelectedValue(val)
                      return val
                    },
                  })}
                />
              </div>
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
              <div className={classReader('field__append field__marginal d-flex no-wrap align-items-center text-gray-7')}>
                {appendChild}
              </div>
            )}

            <div className={classReader('field__append field__marginal d-flex no-wrap align-items-center')}>
              <span className={classReader('select__dropdown-icon')} data-active={isMenuOpen}>
                <i className={classReader('icon icon-triangle-down icon-md')} />
              </span>
            </div>
          </div>

          {Boolean(invalidMsg || hint) && (
            <div className={classReader('field__bottom field__bottom--animated d-flex align-items-flex-start',
              { 'field__bottom--invalid': Boolean(invalidMsg) })}
            >
              <div className={classReader('field__messages col p-0 text-right')}>{invalidMsg || hint}</div>
            </div>
          )}
        </div>
      </section>

      {isMenuOpen && (
        <section
          ref={menuRef}
          className={classReader('select-menu select-menu--square scroll rounded')}
          tabIndex="-1"
          style={menuStyle}
        >
          <div className={classReader('virtual-scroll__content')} tabIndex="-1">
            {options?.map(item => (
              <div
                key={item.value}
                className={classReader(
                  'item item-type item--clickable row no-wrap cursor-pointer manual-focusable',
                  { 'item--dense': optionsDense },
                  { 'item--active': selectedValue === item.value },
                  { [color]: selectedValue === item.value && Boolean(color) },
                  { 'manual-focusable--focused': focusedMenuItem === item.value || selectedValue === item.value },
                )}
                tabIndex="-1"
                onClick={() => handleChange(item)}
                onMouseEnter={() => setFocusedMenuItem(item.value)}
              >
                <div className={classReader('focus-helper')} tabIndex="-1" />

                {Boolean(item.icon) && (
                  <div className={classReader('item__section item__section--side item--column', { [`CommonStyle ${styleName}`]: 'item__section--avatar' })}>
                    <i className={
                      classReader(`icon icon-${item.icon} icon-md`,
                        { [`icon-${color}`]: selectedValue === item.value && Boolean(color) })}
                    />
                  </div>
                )}

                <div className={classReader('item__section item__section--main item--column')}>
                  <div className={classReader('item__label')}>{item.label}</div>

                  {Boolean(item.caption) && (
                    <div className={classReader('item__label item__label--caption')}>{item.caption}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </section>
  )
}

Select.propTypes = {
  appendChild: PropTypes.node,
  className: PropTypes.string,
  clearable: PropTypes.bool,
  color: PropTypes.string,
  controllerError: PropTypes.string,
  dense: PropTypes.bool,
  disabled: PropTypes.bool,
  hint: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onValidate: PropTypes.func,
  options: PropTypes.array.isRequired,
  optionsDense: PropTypes.bool,
  placeholder: PropTypes.string,
  prependChild: PropTypes.node,
  readonly: PropTypes.bool,
  register: PropTypes.func, // with react-hook form
  rounded: PropTypes.bool,
  styleName: PropTypes.string,
  validate: PropTypes.object,
  value: PropTypes.any,  
}

export default Select
