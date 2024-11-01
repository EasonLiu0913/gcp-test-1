import React, { memo } from 'react'
import classReader from 'utils/classReader'
import ReactLoading from 'react-loading'
import { useSelector } from 'react-redux'
import { selectIsLoading, selectLoadingText } from 'slices/loadingSlice'
import Dialog from 'common/Dialog'
import { DEFAULT_SIZES } from 'config/style'

const Loading = (props) => {
  const isLoading = useSelector(selectIsLoading)
  const loadingText = useSelector(selectLoadingText)

  return (
    isLoading && (
      <Dialog prompt persistent>
        <div className={classReader('text-center')}>
          <ReactLoading
            className={classReader('m-auto loading-color')}
            type="spin"
            height={DEFAULT_SIZES.md * 2.5}
            width={DEFAULT_SIZES.md * 2.5}
          />
          {Boolean(loadingText) && (
            <div className={classReader('text-white text-weight-bold text-lg mt-3')}>
              {loadingText}
            </div>
          )}
        </div>
      </Dialog>
    )
  )
}

export default memo(Loading)
