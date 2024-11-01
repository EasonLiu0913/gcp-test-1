// 統一表單驗證提示訊息
export const FORM_VALIDATES_MSG = {

  // 使用者資訊
  nameRequired: '姓名必填',
  userNameRequired: '使用者名稱必填',
  pinRequired: '密碼必填',
  pinCheckRequired: '請再次輸入密碼',
  pinWrongFormat: '密碼格式錯誤',
  companyRequired: '公司必填',
  notPermissions: '請選擇權限',

  // 關鍵字
  notkeyword: '搜尋時請輸入關鍵字',

  // 網域 / 網址
  domainRequired: '網域名稱必填',
  urlOrCode: '搜尋時請輸入短網址 或 短網址代碼',
  urlRequired: '目標網址必填',
  urlWrongFormat: '網址格式錯誤',
  // urlPath: '只允許字母,數字,(-),(_)及中文，不含空格',
  urlPath: '不允許空格,(~),(#),(&),(%)...等特殊符號',
  codeRequired: '活動名稱必填',
  parametersRequiredAtLeastOne: '至少需要一個參數',
  // 品牌A
  brandRequired: '品牌名稱必填',
  brandSelectRequired: '請選擇品牌名稱',
  brandInvalid: '輸入無效 或 網址不屬於該品牌所有',
  brandExceedsLimit: '品牌網域不得超過20字',

  // 方案
  planRequired: '選購方案必選',
  planNameRequired: '方案名稱必填',
  planPriceRequired: '方案金額必填',
  planPriceNaturalNumber: '請填入正確金額',
  planContentRequired: '方案內容至少一項',

  // 一般日期
  startDate: '日期區間（起）必填',
  endDate: '日期區間（迄）必填',

  // Email
  emailRequired: 'Email 必填',
  emailWrongFormat: 'Email 格式錯誤',

  // 角色
  roleNameRequired: '角色中文名稱必填',
  roleCodeRequired: '角色英文名稱必填',
  roleDescRequired: '角色描述必填',
  isCheckOtherRequired: '查看他人資料必選',

  // 到期日期
  expiryDateRequired: '到期日必填',
  expiryStartDate: '到期區間（起）必填',
  expiryEndDate: '到期區間（迄）必填',

  // UTM
  utmSourceRequired: '廣告活動來源必填',
  utmMediumRequired: '廣告活動媒介必填',
  utmCampaignRequired: '廣告活動名稱必填',

  // 行銷活動
  campaignNameRequired: '行銷活動名稱必填',
  campaignStartDateRequired: '資料記錄必填',

  // 新增 / 編輯
  titleRequired: '標題必填',
  tagAtLeastOne: '至少需要一個標籤',
  batchNameRequired: '檔案名稱必填',
  nofilePath: '請選擇要匯入的CSV檔案',

  // 其他
  atLeastOne: '至少填選一項', 
}

export const FORM_VALUE_MAX_LENGTH = {
  destUrl: 1000,
  title: 50,
  tag: 100,
  utmSource: 50,
  utmMedium: 50,
  utmCampaign: 50,
  utmTerm: 50,
  utmContent: 50,
  materialName: 50,
  description: 100,
}

export const FORM_DATA_LIMIT_DEFAULT = {
  startDate: {
    min: null,
    max: null, 
  },
  endDate: {
    min: null,
    max: null, 
  },
}