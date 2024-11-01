/*
 * UI component - AutoComplete 輸入式選單
 *  props
 *   ├ name (string): 識別用，也可搭配 react-hook-form 使用
 *   ├ className (string): 添加 / 覆蓋樣式
 *   ├ styleName (string): 覆蓋的 style module 名稱
 *   ├ id (string): 用於增加識別
 *   ├ value (string): [必填] 選單中選擇的選項
 *   ├ options (string): [必填] 選單 list
 *   ├ placeholder (string): 框內提示
 *   ├ hint (string): 框下提示
 *   ├ validate (object): 驗證內容
 *   ├ color (string): 框線 & icon 顏色，預設 'primary'
 *   ├ noOptionHint (string): 輸入內容無符合選項，預設 '查無符合項目'
 *   ├ dense (boolean): 輸入框是否開起密集樣式，預設 false
 *   ├ optionsDense (boolean): 下拉選單區塊是否開起密集樣式，預設 false
 *   ├ rounded (boolean): 是否開啟框線橢圓樣式，預設 false
 *   ├ clearable (boolean): 是否開啟清除按鈕，預設 false
 *   ├ readonly (boolean): 是否唯獨，預設 false
 *   ├ disabled (boolean): 是否禁用，預設 false
 *   ├ prependChild (node): 框內前方內容區塊
 *   ├ appendChild (node): 框內後方內容區塊
 *   ├ onChange (func): 更動回傳
 *   └ onValidate (func): 驗證結果回傳
 *
 *  補充
 *   └ 可覆蓋 className: field__control
 */

import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  memo,
  useCallback,
} from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'
import $isEmpty from 'lodash/isEmpty'
import { useWindowSize } from 'hooks/useWindowSize'
import Button from 'common/Button'

// https://github.com/react-component/overflow/issues/6
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const initialMenuStyle = {
  minWidth: '',
  top: '',
  left: '',
}

const AutoComplete = ({
  appendChild,
  className,
  clearable = false,
  color = 'primary',
  dense = false,
  disabled = false,
  hint,
  id,
  name,
  noOptionHint = '查無符合項目',
  onChange = () => {},
  onValidate = () => {},
  options = [],
  optionsDense = false,
  placeholder = '',
  prependChild,
  readonly = false,
  rounded = false,
  styleName = '',
  validate,
  value,
}) => {

  const { windowWidthSize, windowHeightSize } = useWindowSize()

  const [searchText, setSearchText] = useState('')
  const [filterOptions, setFilterOptions] = useState([])
  const [invalidMsg, setInvalidMsg] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState(initialMenuStyle)
  const [focusedMenuItem, setFocusedMenuItem] = useState('')

  const menuRef = useRef(null)
  const controlRef = useRef(null)

  const toggleMenu = (e) => {
    if (readonly || disabled) return
    // 點擊到 input 或是 button (清除按鈕) 時， 開啟 / 不關閉 Menu
    const isActionTarget = e.target?.tagName === 'INPUT' || e.target?.tagName === 'BUTTON'
    setIsMenuOpen(prev => isActionTarget || !prev)
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

  const handleSearch = useCallback((searchLabel) => {
    const newOptions = options.filter(item => {
      const lowerLabel = item?.label.toLowerCase()
      // 移除特殊符號避免 match 報錯: javascript syntax error: invalid regular expression
      const searchLowerLabel = (searchLabel.replace(/([.?*+^$[\]\\(){}|-])/g, '')).toLowerCase()
      return lowerLabel?.match(searchLowerLabel) || false
    })

    setSearchText(searchLabel)
    setFilterOptions(newOptions)
  }, [options])

  const handleChange = (val) => {
    handleValid(val)
    onChange(val, name)
    setIsMenuOpen(false)
  }

  const atClickReset = () => {
    handleValid('')
    setSearchText('')
    onChange('', name)
  }

  // 依據畫面長寬變動，一同改變  Menu 位置
  useIsomorphicLayoutEffect(() => {
    const body = window.document.body

    // Menu 開啟時，隱藏滾輪軸
    body.classList.toggle(classReader('overflow-hidden'), isMenuOpen)

    if (isMenuOpen) {
      const scrollTop = window.document.documentElement.scrollTop
      const controlTop = controlRef.current?.offsetTop || 0
      const controlLeft = controlRef.current?.offsetLeft || 0
      const controlHeight = controlRef.current?.offsetHeight || 0
      const controlWidth = controlRef.current?.offsetWidth || 0
      const menuHeight = menuRef.current?.offsetHeight || 0

      // 20 => margin-bottom, 6 => design
      let menuTop = controlTop + controlHeight + 20 + 6 - scrollTop
      if (windowHeightSize < controlTop && windowHeightSize >= Math.abs(scrollTop - menuHeight)) {
        menuTop -= menuHeight + controlHeight
      }

      setMenuStyle(prev => ({
        ...prev,
        minWidth: `${controlWidth}px`,
        top: `${menuTop}px`,
        left: `${controlLeft}px`,
      }))
    }
  }, [
    windowWidthSize,
    windowHeightSize,
    isMenuOpen,
    dense,
  ])

  // Menu 開啟 => 顯示符合的項目 + 附值輸入框內容
  // Menu 關閉 => 重置輸入框內容
  useEffect(() => {
    handleSearch(value)
  }, [
    isMenuOpen,
    value,
    handleSearch,
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

  const isShowClearButton = clearable && readonly === false && disabled === false && (Boolean(value) || value === 0)
  return (
    <>
      <section
        ref={controlRef}
        className={
          classReader(
            'select select--without-input field--outlined no-wrap',
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
              { 'text-red': Boolean(invalidMsg) },
              { [`text-${color}`]: Boolean(color) && invalidMsg === '' },
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
                <input
                  className={classReader('field__input field__native col')}
                  value={searchText}
                  placeholder={placeholder}
                  onChange={(e) => handleSearch(e.target.value)}
                  tabIndex="0"
                  autoComplete="off"
                />
              </div>
            </div>

            {isShowClearButton && (
              <div className={classReader('field__append field__marginal d-flex no-wrap align-items-center')}>
                <Button
                  className={classReader('field__clearable-action')}
                  icon="stroke-close"
                  color="gray-4"
                  textColor="light"
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

          {Boolean(invalidMsg) && (
            <div className={classReader('field__bottom field__bottom--animated d-flex align-items-flex-start', { 'field__bottom--invalid': Boolean(invalidMsg) })}>
              <div className={classReader('field__messages col p-0')}>{invalidMsg || hint}</div>
            </div>
          )}
        </div>
      </section>

      {isMenuOpen && (
        <section
          ref={menuRef}
          className={classReader('select-menu select-menu--square scroll')}
          tabIndex="-1"
          style={menuStyle}
        >
          <div className={classReader('virtual-scroll__content')} tabIndex="-1">
            {filterOptions?.map(item => (
              <div
                key={item.value}
                className={classReader(
                  'item item-type item--clickable row no-wrap cursor-pointer manual-focusable',
                  { 'item--dense': optionsDense },
                  { 'item--active': value === item.value },
                  { [`text-${color}`]: value === item.value && Boolean(color) },
                  { 'manual-focusable--focused': focusedMenuItem === item.value || value === item.value },
                )}
                tabIndex="-1"
                onClick={() => handleChange(item.value)}
                onMouseEnter={() => setFocusedMenuItem(item.value)}
              >
                <div className={classReader('focus-helper')} tabIndex="-1" />

                {Boolean(item.icon) && (
                  <div className={classReader('item__section item__section--side item--column', { [`CommonStyle ${styleName}`]: 'item__section--avatar' })}>
                    <i className={classReader(`icon icon-${item.icon} icon-md`, { [`icon-${color}`]: value === item.value && Boolean(color) })} />
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

            {$isEmpty(filterOptions) && (
              <div className={classReader('item item-type row no-wrap')}>
                <div className={classReader('item__section item__section--main item--column text-gray-5')}>
                  {noOptionHint}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  )
}

AutoComplete.propTypes = {
  appendChild: PropTypes.node,
  className: PropTypes.string,
  clearable: PropTypes.bool,
  color: PropTypes.string,
  dense: PropTypes.bool,
  disabled: PropTypes.bool,
  hint: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  noOptionHint: PropTypes.string,
  onChange: PropTypes.func,
  onValidate: PropTypes.func,
  options: PropTypes.array.isRequired,
  optionsDense: PropTypes.bool,
  placeholder: PropTypes.string,
  prependChild: PropTypes.node,
  readonly: PropTypes.bool,
  rounded: PropTypes.bool,
  styleName: PropTypes.string,
  validate: PropTypes.object,
  value: PropTypes.string.isRequired,
}

export default memo(AutoComplete)
