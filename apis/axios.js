import axios from 'axios'
import {
  ENV_INFO,
  OAUTH,
} from 'config/config'
import Cookies from 'js-cookie'

export const createAxios = (cancel) => {

  const instance = axios.create({
    baseURL: ENV_INFO.apiRoot,
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    timeout: 180000, // 3分鐘
  })

  instance.interceptors.request.use((request) => {
    // 請求前的共同行為
    const req = { ...request }
    if (cancel !== void 0) req.signal = cancel?.signal

    // Client-side-only code
    if (typeof window !== 'undefined') {
      const token = Cookies.get(OAUTH.TOKEN)

      if (token !== null) {
        req.headers['Authorization'] = `Bearer ${token}`
        req.headers['Access-Control-Allow-Origin'] = '*'
      }
    }

    return req
  })

  instance.interceptors.response.use((res) => {
    // 回應後的共同行為
    return res
  },
  async (err) => {
    let customResponse = {}

    // 匯出 EXCEL 時，錯誤後端傳遞解析
    if (err?.request?.responseType === 'blob') {
      const response = new Response(err.response.data)
      const json = await response.json()
      customResponse = {
        errorNo: json.errorNo,
        status: json.success,
        message: json.message,
      }
    } else {
      // 錯誤後返回握物訊息
      const errorStatus = err.response?.status
      const errorNo = err.response?.data?.errorNo
      const errorMsg = err.response?.data?.message || err.response?.data?.messages
      customResponse = {
        errorNo: isNaN(errorNo) ? 9999 : errorNo,
        status: errorStatus,
        message: errorMsg,
      }
    }

    throw customResponse
  })

  return instance
}