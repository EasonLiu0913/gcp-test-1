// src/context/ErrorContext.js
import React, {
  createContext, useContext, useState, useEffect,
} from 'react'
import withRouter from 'common/hoc/withRouter' 
import { useSnackbar } from 'notistack'
import classReader from 'utils/classReader'
import Modal from 'common/Modal'
import { rules } from 'utils/validation'
import { isArray } from 'lodash'
import { 
  ERROR_SYSTEM_ALERT_DEFINED_DATA,
  ERROR_SYSTEM_ALERT_CODE_LIST,
  SHOULD_REDIRECT_ERROR_CODE_LIST,
  ERROR_CODE_LABEL,
  ERROR_CHECK_PREMISSION_CODE_LIST,
} from 'config/error'
// import { useDispatch } from 'react-redux'
// import { removeUser } from 'slices/userSlice'
// import { useRouter } from 'next/router'
// import Cookies from 'js-cookie'

const ErrorContext = createContext({
  error: null,
  reportError: () => {},
  clearError: () => {},
})

export const useError = () => useContext(ErrorContext)

const ErrorProviderBase = ({ children, router }) => {

  // const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  // const router = useRouter()
  const [error, setError] = useState(ERROR_SYSTEM_ALERT_DEFINED_DATA.default)
  
  const reportError = (err) => {
    const {
      errorNo, message, routerPush,
    } = err

    // Popup Alert 指跳一次，避免重複跳出，當已經有錯誤資訊，則以第一次的錯誤資訊為主
    if (!rules.required(error.status)) {

      /**
       * 處理錯誤訊息優先級
       * 1. 無權限，登出跳回登入畫面 => SHOULD_REDIRECT_ERROR_CODE_LIST
       */

      if (SHOULD_REDIRECT_ERROR_CODE_LIST.includes(errorNo)){
        // dispatch(removeUser())
        // Cookies.remove(OAUTH.TOKEN)
        router.push('/login')
      } else {

        if (ERROR_CHECK_PREMISSION_CODE_LIST.includes(errorNo) && !rules.required(routerPush)) {
          router.push(router.asPath, { query: { err: 1 } })
        } 
        
        if (ERROR_SYSTEM_ALERT_DEFINED_DATA.hasOwnProperty(errorNo)){
          setError(prevState => ({
            ...prevState,
            errorNo: errorNo,
            title: ERROR_SYSTEM_ALERT_DEFINED_DATA[errorNo].title || title,
            message: ERROR_SYSTEM_ALERT_DEFINED_DATA[errorNo].message || message,
            status: true,
            btnText: ERROR_SYSTEM_ALERT_DEFINED_DATA[errorNo].btnText || error.btnText,
            routerPush: ERROR_SYSTEM_ALERT_DEFINED_DATA[errorNo].routerPush || routerPush,
          }))
        } else if (ERROR_SYSTEM_ALERT_CODE_LIST.includes(errorNo)) { 
          setError(prevState => ({
            ...prevState,
            errorNo: errorNo,
            title: '系統提示',
            message: message,
            status: true,
            routerPush: routerPush,
          }))
        } else {
          if (isArray(message)) {
            let s = 0
            message.map(item => {
              setTimeout(() => {
                enqueueSnackbar(`${item} ${Boolean(error.errorNo) ? `error: ${error.errorNo}` : ''}`, { className: classReader('error bg-error-light') })
              }, s)
              s += 150
            })
          } else {
            const msg = rules.required(message) ? message : rules.required(error.errorNo) ? ERROR_CODE_LABEL[error.errorNo] : ERROR_CODE_LABEL[9999]
            enqueueSnackbar(`${msg} ${Boolean(error.errorNo) ? `error: ${error.errorNo}` : ''}`, { className: classReader('error bg-error-light') })
          }
        }
      }
    }

  }

  // 關閉 Popup
  const clearError = () => {

    // 導向指定 path
    if (error?.routerPush) {
      router.push(error?.routerPush)
    }

    setError(ERROR_SYSTEM_ALERT_DEFINED_DATA.default)
  }

  useEffect(() => {
  }, [error])

  return (
    <ErrorContext.Provider value={{
      error,
      reportError,
      clearError,
    }}>
      {children}
      <Modal
        prompt={Boolean(error.status)}
        title={error.title}
        okBtn={error.btnText}
        onOk={clearError}
        onClose={clearError}
        close
      >
        <div className={classReader('text-center')}>{error.message}</div>
      </Modal>
    </ErrorContext.Provider>
  )
}

const ErrorProvider = withRouter(ErrorProviderBase)

export { ErrorProvider }
