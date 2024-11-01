import React, { memo } from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'

const ItemSection = ( {
  avatar = false,
  children,
  className,
  id,
  side = false,
}) => {

  return (
    <div
      className={classReader(
        'item__section item--column',
        { 'item__section--side item__section--avatar': avatar },
        { 'item__section--side': side },
        { 'item__section--main': avatar === false && side === false },
        className,
      )}
      id={id}
    >
      {/* <div className={classReader('focus-helper')} tabIndex="-1" /> */}

      {children}
    </div>
  )
}

ItemSection.propTypes = {
  avatar: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
  side: PropTypes.bool,
}

export default memo(ItemSection)