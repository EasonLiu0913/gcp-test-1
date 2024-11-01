export const ERROR_CODE_LABEL = {
  0: '系統發生錯誤',
  1: '帳號重複',
  2: '帳號或密碼錯誤',
  3: '找不到資料',
  4: '驗證失敗',
  5: '查無會員資料',
  6: '無效的資料',
  7: '錯誤的Email',
  8: '錯誤的Phone',
  9: '會員已被停用',
  10: '發生錯誤，請重新嘗試登入', // 401 - 未正確登入
  11: '發生錯誤，請重新嘗試登入', // 403 - 錯誤的存取權限
  12: '無效的生日',
  1001: '姓名必填',
  1003: '品牌名稱必填',
  1005: '品牌domain必填',
  1007: 'Email必填',
  1016: '兩次密碼輸入不同，請再次確認',
  1042: '標題、標籤、目標網址必填',
  1049: '活動名稱必填',
  1050: '缺少上傳檔案',
  1051: '活動開始時間必填',
  1063: '資料重複',
  1070: '專案尚未建立',
  1075: '成員尚未加入專案',
  1076: '專案中有成員',
  1078: '驗證網址已過期',
  9999: '無法完成動作，請稍後再試',
}

/* NOTE:
 * 回首頁或登入按鈕頁: 8000、80002、8003、8004、8005
 * 導去 OAuth 登入頁: 8001、8006、8007
 */
export const OAUTH_ERROR_CODE_LABEL = {
  8000: '發生錯誤，請重新嘗試登入', // clientId 或 redirectUrl 不符合
  8001: '', // 無效的 access token
  8002: '發生錯誤，請重新嘗試登入', // 不支援的授權類型
  8003: '發生錯誤，請重新嘗試登入', // OAuth 登入頁面已過期，請回原登入頁面重新操作。 (Unauthorized Client)
  8004: '發生錯誤，請重新嘗試登入', // 授權錯誤
  8005: '發生錯誤，請重新嘗試登入', // 此會員帳號不存在 !
  8006: '', // 無效的 refresh token
  8007: '', // refresh token 已使用
}

export const SHOULD_REDIRECT_ERROR_CODE_LIST = [
  8,
  9,
  10,
  13,
  14,
  2001,
  2002,
  2003,
  2004,
]

export const ERROR_SYSTEM_ALERT_CODE_LIST = [
  -1,
  2,
  2005,
]

export const ERROR_CHECK_PREMISSION_CODE_LIST = [11]

export const NO_PROJECT_ERROR_NO_LIST = [9, 1075]
export const NO_PROJECT_ERROR_MSG = '您目前尚未加入任ㄧ專案，請聯繫專案管理員，謝謝！'
export const PROJECT_NO_PREMISSIONS_ERROR_MSG = '未加入任何專案，請洽系統管理員。'

export const ERROR_SYSTEM_ALERT_DEFINED_DATA = {
  default: {
    title: '系統訊息',
    errorNo: 0,
    message: null,
    btnText: '確定',
    status: false,
  },
  2005: {
    title: '系統訊息',
    message: '登入已失效或已在其他裝置登入',
    btnText: '返回登入',
    routerPush: '/login',
  },
}