import $camelCase from 'lodash/camelCase'
import { useSelector } from 'react-redux'
import { selectPermissions } from 'slices/userSlice'
import { rules } from 'utils/validation'
import { URCHIN_UTM } from 'config/getParameters'

export const jsonParse = (val, defaultVal = null) => {
  try {
    const json = JSON.parse(val)
    return json || defaultVal
  } catch {
    return defaultVal
  }
}

export const convertToCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => convertToCamelCase(v))
  } else if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => ({
      ...result,
      [$camelCase(key)]: convertToCamelCase(obj[key]),
    }),
    {})
  }
  return obj
}

export const htmlTagFilter = (html) => {
  return html.replace(/<.*?>/g, '')
}

export const searchToObject = (search) => {
  var obj = {}
  var pairs = search.substring(1).split('&')
  for (var i in pairs) {
    if (pairs[i] === '') continue
    var pair = pairs[i].split('=')
    obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1])
  }
  return obj
}

export const objectToSearch = (getData) => {
  const getUrl = new URLSearchParams()
  for (const [key, value] of Object.entries(getData)) {
    if (value !== '') {
      getUrl.append(key, value)
    }
  }
  return getUrl.toString()
}

export const handleHeadParams = (ServerSideContext) => {
  const { req, query } = ServerSideContext
  const protocol = req.headers['x-forwarded-proto'] || 'http'
  const baseUrl = req ? `${protocol}://${req.headers.host}` : ''
  const currentUrl = `${baseUrl}${req.url}`
  const headers = req.headers
  const pathQuery = query

  return {
    currentUrl,
    headers,
    pathQuery,
    baseUrl,
  }
}

export const handleRatioStyle = (propsRatio) => {
  return isNaN(Number(propsRatio)) === false && propsRatio > 0
    ? { paddingTop: `${100 / propsRatio}%` }
    : null
}

export const processedHtmlString = (html) => {
  // 取html結構內的文字 
  // 商品頁遇到=> SEO需用SSR拿到的API資料,原使用DOMParser取Html裡內容,但SSR無法用WebAPI (DOMParser)
  // 故使用正則取得html結構內的文字,目前串接KKday沒問題
  // ----雄獅串結時要注意!!----
  const stripHtml = (html) => {
    return html.replace(/(\r\n|\n|\r)/gm, '').replace(/<[^>]*>?/gm, '')
  }

  const modifiedHtmlString = html
    .replace(/\s+/g, '') // 去除空白
    .replace(/&nbsp;/g, '')
    .replace(/<\/li>/g, ';</li>') // 將</li>作為結尾,加上分號

  const escapeHtml = stripHtml(modifiedHtmlString)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    
  return escapeHtml
}

// 取得 hostname
export const getHostname = (url) => {
  const pattern = /^(https?:\/\/)?([\w.-]+)/
  const match = pattern.exec(url)
  const hostname = match ? match[2] : null

  return hostname
}

// 取得URL階層中最後一層名稱(最右邊一層)
export const lastSegmentOfURL = (url) => {
  const match = url.trim().match(/^(https?:\/\/[^\/]+)\/([^?]+)/)
  return match ? match[2].split('/').pop() : ''
}

export const isEqualType = (value, type) => {
  if (type === 'array') {
    return Array.isArray(value)
  }
  const typeString = typeof value
  return typeString === type
}

// 將UTM參數合併至指定網址字串中相同GET UTM
export const urlUTMFilter = (str, utm) => {
  if (str === undefined) return ''
  let url = new URL(str)
  let getData = url.searchParams

  URCHIN_UTM.map(item => {
    if (!rules.required(getData.get(item)) || !rules.required(utm[item])) {
      getData.delete(item)
    }

    if (rules.required(utm[item]) && utm[item] !== undefined) {
      getData.set(item, utm[item])
    }
  })

  return decodeURIComponent(url.toString())
}

// 改換資料型態
export const changeValueType = (originValue, newType) => {
  if (typeof originValue === 'string') {
    switch (newType) {
    case 'number': 
      return parseInt(originValue)
    case 'array': 
      return originValue.split(',')
    default:
      return originValue
    }
  }

  if (Array.isArray(originValue)) {
    switch (newType) {
    case 'string': 
      return originValue.join(',')
    default:
      return originValue
    }
  }
}

export const convertDataToCsv = (rows, columns) => {
  let csvContent = columns.map(el => el.label).join(',') + '\r\n'
  rows.forEach(function (rowArray) {
    let row = rowArray.join(',')
    csvContent += row + '\r\n'
  })
  return csvContent
}

export const downloadFile = (blob, fileName) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.setAttribute('download', fileName)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export const downloadXlsx = (data, name) => {
  try {
    const fileName = decodeURIComponent(name.split('filename*=UTF-8\'\'')[1]) + '.xlsx'
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    downloadFile(blob, fileName)
  } catch (error) {
    console.error('download error:', error)
  }
}

export const downloadCSV = (blob, filename) => {
  // 讀取 Blob 為文字
  const reader = new FileReader()
  reader.onload = function (event) {
    const text = event.target.result
    const BOM = '\uFEFF'
  
    // 創建帶 BOM 的新 Blob
    const blobWithBom = new Blob([BOM + text], { type: 'text/csv;charset=utf-8;' })
    // 創建下載連結
    const url = window.URL.createObjectURL(blobWithBom)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename) // 指定下載檔名
    document.body.appendChild(link)
    link.click()
  
    // 清理
    link.parentNode.removeChild(link)
    window.URL.revokeObjectURL(url)
  }
  
  // 開始讀取 Blob
  reader.readAsText(blob, 'UTF-8') // 確保以 UTF-8 讀取
}

// return [僅可讀, 可讀可編輯（不可刪）, 全權限]
// pageCode 是和後端溝通好的id 代碼，可參考 'config/menu' 內的MENU
export const useCheckPermission = (pageCode) => {
  const permissionList = useSelector(selectPermissions)
  const permission = permissionList[pageCode]
  
  if (permission) {
    switch (permission) {
    case 'RWD':
      return [
        true,
        true,
        true,
      ]
    case 'RW':
      return [
        true,
        true,
        false,
      ]
    case 'V':
      return [
        true,
        false,
        false,
      ]
    default:
      return [
        false,
        false,
        false,
      ]
    }
  } else {
    return [
      false,
      false,
      false,
    ]
  }
}

// 合並(過濾/去除) Array 中相同資料
export const arrayMargeDuplicateData = (data) => {
  return Array.from(new Set(data))
}

// 複製指定文字
export const textCopy = async (text, message) => {
  try {
    await navigator.clipboard.writeText(text)
    return {
      status: true,
      className: 'success bg-success-light',
      message: `${message} 成功`,
    }
  } catch (err) {
    return {
      status: false,
      className: 'error bg-error-light',
      message: `${message} 失敗`,
    }
  }
}

// URL 標題過濾
export const url_title = (
  str,
  separator = '-',
  lowercase = false,
  onlyEn = false,
) => {

  if (!rules.required(str)) return ''
  
  // 去除HTML標籤
  str = str.replace(/<\/?[^>]+(>|$)/g, '')

  // 主要過濾規則 : 不允許符號 & 中文/不允許符號
  const regSymbol = onlyEn ? /[^\w -]/g : /[^\w\u4e00-\u9fa5 -]/g

  str = str.replace(regSymbol, '')

  // 多個空白連續替換成1個
  str = str.replace(/\s+/g, ' ').trim()

  // 替換銜接符號
  str = str.replace(/[ ]/g, separator)

  // 多個 '-' 空白連續替換成1個 '-'
  str = str.replace(/[-]+/g, '-')

  // 轉小寫
  if (lowercase) str = str.toLowerCase()

  return str
}