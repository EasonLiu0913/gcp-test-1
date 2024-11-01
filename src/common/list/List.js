import React, { memo } from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'

const List = ({
  bordered = false,
  children,
  className,
  dense = false,
  id,
  separator = false,
}) => {

  return (
    <section
      className={classReader(
        'list',
        { 'list--bordered': bordered },
        { 'list--separator': separator },
        { 'list--dense': dense },
        className,
      )}
      id={id}
    >
      {children}
    </section>
  )
}

List.propTypes = {
  bordered: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  dense: PropTypes.bool,
  id: PropTypes.string,
  separator: PropTypes.bool,
}

export default memo(List)