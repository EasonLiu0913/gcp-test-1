/* 時間格式
 * 避免時間於資料間存取、傳遞時受
 *   1. Client 瀏覽器地理位置預設
 *   2. Server 地區時區預設
 *   3. Code 設定
 *   4. DB 時區預設/設定
 * 導致時間產生 +N 問題
 * 前端與後端間的溝通，請依據以下規範
 *   1. 統一使用 Taiwan Taipei 時區時間(+8)
 *   2. 傳遞一律使用字串，不含T
 */

export const DATE_FORMAT = 'YYYY-MM-DD'

export const TIME_FORMAT = 'HH:mm:ss'

export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export const DATETIME_API_FORMAT = 'YYYY-MM-DDTHH:mm:ss'

// 網站全站維護時間
export const WEBSITE_MAINTENANCE_DATE = {
  start: '2023-11-13 09:00:00',
  end: '2023-12-13 10:00:00',
  transitionSeconds: {
    start: 30 * 60, // 提前 N 分鐘顯示置頂維護公告訊息
    end: 0 * 60, // 延後 N 分鐘開放
  },
}
  
// 金流維護時間
export const CASH_FLOW_MAINTENANCE_TIME = {
  // start: '2023-11-19 00:00:00',
  // end: '2023-11-19 07:30:00',
  start: '2023-11-16 00:00:00',
  end: '2023-11-17 07:30:00',
  transitionSeconds: {
    start: 15 * 60, // 提前 N 分鐘阻擋結帳並跳出公告
    end: 15 * 60, // 延後 N 分鐘開放
  },
}

export const MIN_DATE = '1970-01-01 00:00:00'
export const MAX_DATE = '2099-01-01 23:59:59'

