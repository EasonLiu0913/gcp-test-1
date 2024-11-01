import React, { memo } from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'
import ReactLoading from 'react-loading'
import { DEFAULT_SIZES, COLOR_MAPPING } from 'config/style'

const colorCode = (
  color, textColor, isUseColorType,
) => {
  const colorLabel = textColor || (isUseColorType ? color : 'light')
  return COLOR_MAPPING[colorLabel] || COLOR_MAPPING.dark
}

const handleButtonColor = ({
  color,
  textColor,
  flat,
  outline,
}) => {

  let colorSet = ''

  if (Boolean(color)) {
    if (flat || outline) {
      colorSet = color
    } else {
      colorSet = textColor || 'light'
    }
  } else if (Boolean(textColor)) {
    colorSet = textColor
  }

  return colorSet
}

const Button = ({
  ariaLabel = '',
  children,
  className = '',
  closeAnimate = false,
  color = 'primary',
  disabled = false,
  flat = false,
  icon,
  iconColor,
  iconRight,
  iconRightColor,
  id,
  isLoading = false,
  label,
  onClick = () => {},
  onMouseDown = () => {},
  outline = false,
  round = false,
  rounded = false,
  size = 'md',
  square,
  styleName = '',
  textColor = 'white',
  type = 'button',
  unelevated = false,
}) => {
  const buttonColorProps = {
    color,
    textColor,
    flat,
    outline,
  }
  const handleClick = (e) => {
    if (disabled || isLoading) return

    // button click animation
    const rippleDom = e.currentTarget.querySelector('span[data-active="false"]')

    if (rippleDom !== null) {
      rippleDom.setAttribute('data-active', true)
      setTimeout(() => {
        rippleDom.setAttribute('data-active', false)
      }, 400)
    }

    const isOnClickEmpty = !!onClick.toString().match(/{\s*}/)
    const isOnMouseDownEmpty = !!onMouseDown.toString().match(/{\s*}/)

    if (!isOnClickEmpty) onClick && onClick(e)
    if (!isOnMouseDownEmpty) onMouseDown && onMouseDown(e)
  }

  const isUseColorType = flat || outline
  return (
    <button
      className={classReader(
        `btn btn-${size}`,
        `btn__label--${size}`,
        { 'btn--unelevated': unelevated },
        // shapeSet
        { 'btn--round': round },
        { 'btn--rounded': rounded },
        { 'btn--square': square },
        // borderSet
        { 'btn--outline': outline },
        { 'btn--flat': flat },
        // actionSet
        { 'hoverable': disabled === false && isLoading === false },
        { 'disabled': disabled },
        { 'btn--loading': isLoading },
        // colorSet
        { [`bg-${color}`]: Boolean(color) && outline === false && flat === false },
        `${handleButtonColor(buttonColorProps)}`,
        className,
      )}
      id={id}
      type={type}
      disabled={disabled}
      onClick={handleClick}
      onMouseDown={handleClick}
      tabIndex="0"
      aria-label={ariaLabel}
    >
      {isLoading && (
        <ReactLoading
          className={classReader('btn__loading')}
          type="spin"
          color={colorCode(
            color, textColor, isUseColorType,
          )}
          height={DEFAULT_SIZES[size] - 4}
          width={DEFAULT_SIZES[size] - 4}
        />
      )
      }

      <span className={classReader('focus-helper')} tabIndex="-1" />

      {/* can overwritten this className style */}
      <span className={classReader({ [`CommonStyle ${styleName}`]: 'btn__content' }, { 'btn__label--loading': isLoading })}>
        {Boolean(icon) && (
          <i className={
            classReader(
              `icon icon-${icon} icon-${size}`,
              { [`CommonStyle ${styleName}`]: 'left-icon' }, // can overwritten this className style
              Boolean(iconColor) ? `icon-${iconColor}` : `icon-${handleButtonColor(buttonColorProps)}`,
              { 'on-left': Boolean(label) || Boolean(children) },
            )}
          />
        )}

        {Boolean(label) && (<span>{label}</span>)}

        {children}

        {Boolean(iconRight) && (
          <i className={
            classReader(
              `icon icon-${iconRight} icon-${size}`,
              { [`CommonStyle ${styleName}`]: 'right-icon' }, // can overwritten this className style
              Boolean(iconRightColor) ? `icon-${iconRightColor}` : `icon-${handleButtonColor(buttonColorProps)}`,
              { 'on-right': Boolean(label) || Boolean(children) },
            )}
          />
        )}
      </span>

      {closeAnimate === false && (
        <span className={classReader('btn-ripple')} tabIndex="-1">
          <span className={classReader('btn-ripple__inner')} data-active="false" />
        </span>
      )}
    </button>
  )
}

Button.propTypes = {
  ariaLabel: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  closeAnimate: PropTypes.bool,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  flat: PropTypes.bool,
  icon: PropTypes.string,
  iconColor: PropTypes.string,
  iconRight: PropTypes.string,
  iconRightColor: PropTypes.string,
  id: PropTypes.string,
  isLoading: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.func,
  outline: PropTypes.bool,
  round: PropTypes.bool,
  rounded: PropTypes.bool,
  size: PropTypes.oneOf([
    'sm',
    'md',
    'lg',
    'xl',
  ]),
  square: PropTypes.bool,
  styleName: PropTypes.string,
  textColor: PropTypes.string,
  type: PropTypes.string,
  unelevated: PropTypes.bool,
}

export default memo(Button)
