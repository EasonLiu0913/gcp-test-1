import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

import memberAPI from 'apis/member'
import { ERROR_CODE_LABEL, SHOULD_REDIRECT_ERROR_CODE_LIST } from 'config/error'
import { OAUTH } from 'config/config'
import { localStorage } from 'utils/storage'


export const useApiError = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const ecErrorCode = () => {
    const date = new Date()
    const code = [
      'EC',
      date.getFullYear().toString().slice(-2),
      `0${date.getMonth()}`.slice(-2),
      `0${date.getDate()}`.slice(-2),
      `0${date.getHours()}`.slice(-2),
      `0${date.getMinutes()}`.slice(-2),
    ].join('')
    return code
  }

  const handleApiError = (error, setDialog) => {
    setDialog(prevState => ({ 
      ...prevState,
      errorNo: error.errorNo,
      data: error,
      code: ecErrorCode(),
      msg: ERROR_CODE_LABEL[error.errorNo] || ERROR_CODE_LABEL[0],
    }))
  }

  const clearTokenAndRedirect = () => {
    localStorage.clear()
    router.push('/')
  }

  // 等待一個家，讓 logout 獨立出去
  const cmsLogout = async () => {
    dispatch({ type: 'loading/openLoading' })
    try {
      // const result = await memberAPI.signOut()
      // if (!result.success) throw result
    } catch (error) {
    } finally {
      clearTokenAndRedirect()
      dispatch({ type: 'loading/closeLoading' })
    }
  }

  const shouldApiErrorLogout = async (dialogData) => {
    if (SHOULD_REDIRECT_ERROR_CODE_LIST.includes(dialogData.errorNo)) {
      dispatch({ type: 'loading/openLoading' })
      clearTokenAndRedirect()
      dispatch({ type: 'loading/closeLoading' })
    }
  }
  
  return {
    shouldApiErrorLogout,
    handleApiError,
    cmsLogout,
  }
}

