import React, { memo } from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'

const Badge = ({
  children,
  className,
  color,
  floating = false,
  id,
  outline = false,
  rounded = false,
  textColor,
}) => {

  const badgeColor = outline ? color || textColor : textColor
  const badgeShape = floating && rounded ? 'circle' : 'default'
  return (
    <div
      className={classReader(
        'badge no-wrap badge--single-line',
        `badge--${badgeShape}-padding`,
        { [`${badgeColor}`]: Boolean(badgeColor) },
        { [`bg-${color}`]: Boolean(color) && outline === false },
        { 'badge--outline': outline },
        { 'badge--floating': floating },
        { 'badge--rounded': rounded },
        className,
      )}
      id={id}
    >
      {children}
    </div>
  )
}

Badge.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.string,
  floating: PropTypes.bool,
  id: PropTypes.string,
  outline: PropTypes.bool,
  rounded: PropTypes.bool,
  textColor: PropTypes.string,
}

export default memo(Badge)