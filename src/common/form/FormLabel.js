import React, { memo } from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'

const FormLabel = ({
  className,
  id,
  isInvalid = false,
  label,
  required = false,
}) => {

  return (
    <div className={classReader('field__label', className)} id={id}>
      {Boolean(label) && <span className={classReader({ 'text-red': isInvalid })}>{label}</span>}
      {required === true && <span className={classReader('text-red ml-1')}>*</span>}
    </div>
  )
}

FormLabel.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  isInvalid: PropTypes.bool,
  label: PropTypes.string,
  required: PropTypes.bool,
}

export default memo(FormLabel)
