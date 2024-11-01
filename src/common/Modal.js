import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'
import Dialog from 'common/Dialog'
import Card from 'common/card/Card'
import Button from 'common/Button'
import Separator from 'common/Separator'

const Modal = ({
  cancelBtn = '',
  children,
  className,
  close,
  id,
  onCancel = () => {},
  onClose = () => {},
  onOk = () => {},
  okBtn = '',
  persistent = false,
  prompt = false,
  reverseBtn = false,
  separator = false,
  title = '',
  titleAlign,
  width = 420,
}) => {

  const [isOkLoading, setIsOkLoading] = useState(false)
  const [isCancelLoading, setIsCancelLoading] = useState(false)

  const handleBtnAction = async (isOkBtn, action) => {
    isOkBtn ? setIsOkLoading(true) : setIsCancelLoading(true)
    await action()
    if (isOkBtn) {
      setIsOkLoading(false)
    } else {
      setIsCancelLoading(false)
    }
  }

  const hasTitleBlock = Boolean(title) || close
  return (
    <Dialog
      prompt={prompt}
      onClose={onClose}
      persistent={persistent}
      className={classReader('modal')}
    >
      <Card
        className={classReader(className)}
        id={id}
        title={title}
        width={width}
      >
        {hasTitleBlock && (
          <div className={classReader('p-0')}>
            <div className={classReader('d-flex justify-content-between align-items-center')}>
              <div className={classReader('card__title', { [`text-${titleAlign}`]: Boolean(titleAlign) })}>
                {title}
              </div>

              {close && (
                <Button
                  className={classReader('card__close-button')}
                  icon="stroke-close"
                  size="md"
                  color="text-secondary"
                  onClick={() => onClose(false)}
                  flat
                  round
                />
              )}
            </div>
          </div>
        )}

        {separator && (<Separator color="gray-3" />)}

        <div className={classReader('modal__content', { 'border-top': hasTitleBlock })}>
          {children}
        </div>

        <div className={classReader('modal__btn d-flex flex-row', { reverseBtn })}>
          {okBtn &&
            <Button
              className={classReader('btn--unelevated')}
              color="primary"
              onClick={() => handleBtnAction(true, onOk)}
              isLoading={isOkLoading}>
              {okBtn}
            </Button>
          }
          {cancelBtn &&
            <Button
              className={classReader('btn--unelevated')}
              onClick={() => handleBtnAction(false, onCancel)}
              color="error"
              isLoading={isCancelLoading}>
              {cancelBtn}
            </Button>
          }
        </div>
      </Card>
    </Dialog>
  )
}

Modal.propTypes = {
  cancelBtn: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  close: PropTypes.bool,
  id: PropTypes.string,
  isCancelDisabled: PropTypes.bool,
  isOKDisabled: PropTypes.bool,
  onCancel: PropTypes.func,
  onClose: PropTypes.func,
  onOk: PropTypes.func,
  okBtn: PropTypes.string,
  persistent: PropTypes.bool,
  prompt: PropTypes.bool,
  reverseBtn: PropTypes.bool,
  separator: PropTypes.bool,
  title: PropTypes.string,
  titleAlign: PropTypes.string,
  width: PropTypes.number,
}

export default memo(Modal)
