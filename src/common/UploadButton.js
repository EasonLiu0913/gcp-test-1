import React, {
  memo, useCallback, useEffect, useState,
} from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'

const UploadButton = ({
  acceptType = '',
  className = '',
  controllerError = '',
  label = '',
  name = '',
  onChange = (name, value) => {},
  register = () => {},
  validate = {},
}) => {

  const [registerOptions, setRegisterOptions] = useState({})
  const [invalidMsg, setInvalidMsg] = useState('')

  const handleClick = (e) => {
    const rippleDom = e.currentTarget.querySelector('span[data-active="false"]')

    if (rippleDom !== null) {
      rippleDom.setAttribute('data-active', true)
      setTimeout(() => {
        rippleDom.setAttribute('data-active', false)
      }, 400)
    }
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
  }

  const handleChange = useCallback((e) => {
    onChange(name, e.target.value)
    handleValid(e.target.value)
  }, [])

  useEffect(() => {
    setInvalidMsg(controllerError)
  }, [controllerError])

  useEffect(() => {
    if (typeof register !== 'function') return

    setRegisterOptions(register(name, {
      validate,
      onChange: handleChange, 
    }))
  }, [name, register])

  return (
    <>
      <div className={classReader('red my-1')}>{invalidMsg}</div>
      <label className={classReader('white bg-secondary btn btn-md', className)} onClick={handleClick}>
        <span className={classReader('focus-helper')}/>
        <span className={classReader('btn__content')}>
          <i className={classReader('icon icon-upload icon-white on-left')} />
          <span>{label}</span>
        </span>
        <span className={classReader('btn-ripple')} tabIndex="-1">
          <span className={classReader('btn-ripple__inner')} data-active="false" />
        </span>
        <input
          type="file"
          className={classReader('d-none')}
          accept={acceptType}
          {...registerOptions}
        />
      </label>
    </>
  )
}

UploadButton.propTypes = {
  acceptType: PropTypes.string,
  className: PropTypes.string,
  controllerError: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  register: PropTypes.func,
  validate: PropTypes.object,
}

export default memo(UploadButton)
