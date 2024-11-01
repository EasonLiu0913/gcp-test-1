import { dateTimeApiFormat } from 'utils/date'
import { urlUTMFilter, lastSegmentOfURL } from 'utils/util'
import { rules } from 'utils/validation'
import {
  START_DATE_KEY,
  END_DATE_KEY,
  URL_DECODE_KEY,
  URL_CODE_KEY,
  ARRAY_TRIM_KEY,
} from 'config/apiParamsFilter'
import { isArray } from 'lodash'
/*
 * 統一 API 參數過濾行為
 * 該檔案只針對 API 參數進行定義好的過濾
 * 主要過濾行為 :
 * 1. 根據需求開關，刪除無用參數
 * 2. 字串去除前後空白
 * 3. 轉換時間參數格式
 * 4. 針對指定 URL 進行 decodeURIComponent，避免查詢中文亂碼無法 mapping
 * 5. [新增/編輯] 只要參數中包含 destUrl(目標網址)，根據參數中的 UTM 進行資料合併
 * 6. 查詢 code，可輸入短網址 or 代碼，輸入短網址會自動過濾為代碼
 */

// 2. 字串去除前後空白
const removeSpaces = (params, key) => {
  if (typeof params[key] === 'string' ) params[key] = params[key].trim()

  // 避免資料為 undefined, null 無效資料，資料內部需進行檢查
  if (ARRAY_TRIM_KEY.includes(key) && isArray(params)) {
    params[key] = params[key].map(e => {
      if (typeof e === 'string') return e.trim()
      if (typeof e === 'number' || typeof e === 'boolean') return e
    })
  }
  
  return params
}

// 3. 統一轉換時間參數格式
const unifiedTimeFormat = (params, key) => {
  if (rules.required(params[key])){
    if (START_DATE_KEY.includes(key)) params[key] = dateTimeApiFormat(params[key], 0)
    if (END_DATE_KEY.includes(key)) params[key] = dateTimeApiFormat(params[key], 'end')
  }
  return params
}

// 4. 針對指定 URL 進行 decodeURIComponent
const handleURI = (params, key) => {
  if (URL_DECODE_KEY.includes(key)) params[key] = decodeURIComponent(params[key])
  return params
}

// 只用於查詢
export const specifyParameterFilterForSearch = (params, queryString = false) => {

  for (let key in params) {

    // 1. 根據需求開關，刪除無用參數
    if (!rules.required(params[key])) {
      delete params[key]
      continue
    }
    
    // 2. 字串去除前後空白
    params = removeSpaces(params, key)

    // 3. 統一轉換時間參數格式
    params = unifiedTimeFormat(params, key)

    // 4. 針對指定 URL 進行 decodeURIComponent
    params = handleURI(params, key)
    
    // 6. 查詢 code，可輸入短網址 or 代碼，會自動過濾為代碼
    if (URL_CODE_KEY.includes(key) && rules.isDomain(params[key])) params[key] = lastSegmentOfURL(params[key])
  }

  return queryString ? new URLSearchParams(params).toString() : params
}

// 用於新增/編輯
export const specifyParameterFilter = (params, deleteParams = false) => {
  for (let key in params) {

    // 1. 根據需求開關，刪除無用參數
    if (deleteParams && !rules.required(params[key])){
      delete params[key]
      continue
    }
    
    // 2. 字串去除前後空白
    params = removeSpaces(params, key)
        
    // 3. 統一轉換時間參數格式
    params = unifiedTimeFormat(params, key)

    // 5. 只要參數中包含 destUrl(目標網址)，根據參數中的 UTM 進行資料合併
    if (key === 'destUrl') {
      params[key] = urlUTMFilter( params[key], {
        utm_source: params?.utmSource,
        utm_medium: params?.utmMedium,
        utm_campaign: params?.utmCampaign,
        utm_term: params?.utmTerm,
        utm_content: params?.utmContent,
      })
    }

    // 4. 針對指定 URL 進行 decodeURIComponent
    params = handleURI(params, key)
  }

  return params
}