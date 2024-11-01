import React, { memo } from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'
import Modal from 'common/Modal'
import { ERROR_CODE_LABEL } from 'config/error'

const SystemAlert = ({
  buttonChildren,
  cancel = false,
  cancelLabel = '取消',
  children,
  className,
  id,
  onClose = () => {},
  onSubmit = () => {},
  persistent = false,
  prompt = false,
  submit = false,
  submitDisabled = false,
  submitLabel = '確定',
  title = '系統提示',
  titleAlign,
} ) => {

  return (
    <Modal
      className={classReader('cis-modal', className)}
      id={id}
      prompt={prompt}
      title={title}
      titleAlign={titleAlign}
      separator
      persistent={persistent}
      close={onClose}
      onClose={onClose}
      okBtn={submit}
      onOk={onSubmit}
    >
      {children}
      <p className={classReader('text-center m-0 mb-3')}>抱歉</p>
      <p className={classReader('text-center m-0')}>{ERROR_CODE_LABEL[9999]}</p>
    </Modal>
  )
}

SystemAlert.propTypes = {
  buttonChildren: PropTypes.node,
  cancel: PropTypes.bool,
  cancelLabel: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  persistent: PropTypes.bool,
  prompt: PropTypes.bool,
  submit: PropTypes.bool,
  submitDisabled: PropTypes.bool,
  submitLabel: PropTypes.string,
  title: PropTypes.string,
  titleAlign: PropTypes.string,
}

export default memo(SystemAlert)
