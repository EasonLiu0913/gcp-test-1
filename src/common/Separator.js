import React, { memo } from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'

const Separator = ({
  className,
  color,
  dark = false,
  id,
  inset = false,
  vertical = false,
}) => {

  const separatorSide = vertical ? 'vertical' : 'horizontal'
  return (
    <hr
      className={classReader(
        'separator',
        `separator--${separatorSide}`,
        { [`separator--${separatorSide}-inset`]: inset },
        { [`bg-${color}`]: Boolean(color) },
        { 'separator--dark': dark },
        className,
      )}
      id={id}
    />
  )
}

Separator.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  dark: PropTypes.bool,
  id: PropTypes.string,
  inset: PropTypes.bool,
  vertical: PropTypes.bool,
}

export default memo(Separator)
