import React, { memo } from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'

const Item = ({
  active = false,
  activeColor,
  activeFocused = false,
  activeTextColor,
  clickable = false,
  children,
  className,
  color,
  dense = false,
  headerInsetLevel = 0,
  id,
  onClick = () => {},
  textColor,
}) => {

  const itemLevelStyle = { style: { paddingLeft: `${headerInsetLevel * 20 + 16}px` } }
  const itemAttr = headerInsetLevel > 0 ? itemLevelStyle : {}
  const itemColor = active ? activeColor : color
  const itemTextColor = active ? activeTextColor : textColor
  return (
    <div
      className={classReader(
        'item item-type row no-wrap',
        { 'item--clickable cursor-pointer focusable hoverable': clickable },
        { 'item--dense': dense },
        { 'item--active manual-focusable--focused': activeFocused && active },
        { [`text-${itemTextColor}`]: Boolean(textColor || activeTextColor) },
        { [`bg-${itemColor}`]: Boolean(color || activeColor) },
        className,
      )}
      id={id}
      onClick={onClick}
      {...itemAttr}
    >
      {clickable && <div className={classReader('focus-helper')} tabIndex="-1" />}

      {children}
    </div>
  )
}

Item.propTypes = {
  active: PropTypes.bool,
  activeColor: PropTypes.string,
  activeFocused: PropTypes.bool,
  activeTextColor: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  clickable: PropTypes.bool,
  color: PropTypes.string,
  dense: PropTypes.bool,
  headerInsetLevel: PropTypes.number, // for expansionItem
  id: PropTypes.string,
  onClick: PropTypes.func,
  textColor: PropTypes.string,  
}

export default memo(Item)