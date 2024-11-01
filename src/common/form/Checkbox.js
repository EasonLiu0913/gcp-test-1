/*
 * UI component - Checkbox 勾選框
 *  props
 *   ├ name (string): 識別用，也可搭配 react-hook-form 使用
 *   ├ className (string): 添加 / 覆蓋樣式
 *   ├ styleName (string): 覆蓋的 style module 名稱
 *   ├ id (string): 用於增加識別
 *   ├ label (string): 對應名稱
 *   ├ value (string || number): 對應值
 *   ├ size (string): 勾選框大小 ('sm', 'md')，預設 'md
 *   ├ checked (boolean): 勾選值
 *   ├ validate (string): 驗證內容
 *   ├ color (string): e. 勾選框已勾選時的顏色，預設 'primary'
 *   ├ keepColor (boolean): 是否在未勾選時套用顏色，預設 false
 *   ├ readonly (boolean): 是否唯獨，預設 false
 *   ├ disabled (boolean): 是否禁用，預設 false
 *   ├ row (boolean): 勾選框是否水平並排，預設 false
 *   ├ register (func): 搭配 react-hook-form 使用
 *   ├ onSetSelectionList (func): 更動回傳，搭配 react-hook-form 使用
 *   └ onChange (func): 更動回傳
 *
 *  補充
 *   └ 可覆蓋 className: checkbox__inner
 */

import React, {
  useState,
  useEffect,
  useCallback,
  memo,
} from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'

const Checkbox = ({
  checked,
  className,
  color = 'primary',
  disabled = false,
  id,
  keepColor = false,
  label,
  name,
  onChange = () => {},
  onSetSelectionList = () => {},
  readonly = false,
  register,
  row = false,
  size = 'md',
  styleName = '',
  validate,
  value,
}) => {

  // handle if used with react hook form
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [registerOptions, setRegisterOptions] = useState({})

  const handleClick = (e) => {
    e.stopPropagation()

    const inputDom = e.currentTarget.querySelector('input')
    if (inputDom !== null) inputDom.click()
  }

  const handleValid = useCallback((e) => {
    if (readonly || disabled) return

    onChange(
      e.target.value, e.target.checked, name,
    )

    // with react hook form
    if (typeof register === 'function') {
      if (checked === void 0) {
        setCheckboxChecked(e.target.checked)
      } else {
        onSetSelectionList(e.target.value, e.target.checked)
      }
    }
  }, [])

  useEffect(() => {
    if (checked === void 0) return
    setCheckboxChecked(checked)
  }, [checked])

  // with react hook form
  useEffect(() => {
    if (typeof register !== 'function') return
    setRegisterOptions(register(name, {
      validate,
      onChange: handleValid,
      setValueAs: (defaultVal) => {
        let isActive = false
        if (typeof defaultVal === 'string') {
          isActive = defaultVal === value
          setCheckboxChecked(isActive)
        } else if (typeof defaultVal === 'boolean') {
          setCheckboxChecked(defaultVal)
        } else {
          for (const val of defaultVal) {
            onSetSelectionList(val, true)
          }
        }
        return defaultVal
      },
    }))
  }, [
    name,
    value,
    register,
    handleValid,
  ])

  const checkboxType = checkboxChecked ? 'truthy' : checkboxChecked === false ? 'falsy' : 'indet'
  return (
    <div
      className={classReader(
        'checkbox no-outline no-wrap',
        { 'd-flex': row },
        { 'disabled': disabled },
        { 'checkbox--readonly': readonly },
        className,
      )}
      id={id}
      onClick={handleClick}
    >
      <div
        className={classReader(
          'relative-position non-selectable',
          { [`CommonStyle ${styleName}`]: 'checkbox__inner' }, // can overwritten this className style
          `checkbox__inner--${checkboxType}`,
          `checkbox__inner--${size}`,
          { [`text-${color}`]: keepColor || checkboxChecked },
        )}
      >
        <input
          className={classReader('hidden checkbox__native absolute')}
          type="checkbox"
          name={name}
          value={value}
          checked={checkboxChecked || false}
          onChange={handleValid}
          {...registerOptions}
        />

        <div className={classReader('checkbox__bg absolute non-selectable')}>
          <svg className={classReader('checkbox__svg absolute-full')} viewBox="0 0 24 24">
            <path className={classReader('checkbox__truthy')} fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
            <path className={classReader('checkbox__indet')} d="M4,14H20V10H4" />
          </svg>
        </div>
      </div>

      <div className={classReader('checkbox__label')}>
        {label}
      </div>
    </div>
  )
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  className: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  keepColor: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onSetSelectionList: PropTypes.func,
  readonly: PropTypes.bool,
  register: PropTypes.func, // with react-hook form
  row: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md']),
  styleName: PropTypes.string,
  validate: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default memo(Checkbox)