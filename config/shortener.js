import { DEFAULT_DELETE_DLG_DATA } from './permission/brand'
export const STEPS = [
  '設定網址資訊',
  '設定UTM',
  '自訂OG',
]

export const STEPS_BATCH = ['上傳CSV', '確認資料']

export const SHORTENER_UTM_DATA = {
  demo: {
    title: '您可以在以下欄位中自行加入所需的廣告追蹤碼',
    label: 'generated URL :',
  },
  utm: [
    {
      name: 'utmSource',
      title: '廣告活動來源 utm_source',
      placeholder: 'e.g., google, fb, line',
    },
    {
      name: 'utmMedium',
      title: '廣告活動媒介 utm_medium',
      placeholder: 'e.g., cpc, banner, email',
    },
    {
      name: 'utmCampaign',
      title: '廣告活動名稱 utm_campaign',
      placeholder: 'Product, promo code or slogan(e.g., big_sale)',
    },
    {
      name: 'utmTerm',
      title: '廣告活動字詞 utm_term',
      placeholder: 'Identify the paid keywords',
    },
    {
      name: 'utmContent',
      title: '廣告活動內容 utm_content',
      placeholder: 'Use to differentiate ads (e.g., 600px_banner)',
    }, 
  ],
}

export const MAXROW = 500

export const BATCH_EXCRL_LABEL_DATA = {
  sort: {
    name: '排序',
    remark: '',
    index: null, 
  },
  destUrl: {
    name: '目標網址',
    remark: '',
    index: null, 
  },
  title: {
    name: '標題',
    remark: '',
    index: null, 
  },
  tag: {
    name: '標籤',
    remark: '',
    index: null, 
  },
  expiryDate: {
    name: '到期日',
    remark: '',
    index: null, 
  },
  utmSource: {
    name: '活動來源',
    remark: '(utm_source)',
    index: null, 
  },
  utmMedium: {
    name: '活動媒介',
    remark: '(utm_medium)',
    index: null, 
  },
  utmCampaign: {
    name: '活動名稱',
    remark: '(utm_campaign)',
    index: null, 
  },
  utmTerm: {
    name: '活動字詞',
    remark: '(utm_term)',
    index: null, 
  },
  utmContent: {
    name: '活動內容',
    remark: '(utm_content)',
    index: null, 
  },
  materialName: {
    name: '素材名稱',
    remark: '',
    index: null, 
  },
  description: {
    name: '描述',
    remark: '',
    index: null, 
  },
}

export const INDIVIDUAL_EXCRL_LABEL_DATA = {
  phone: {
    name: 'Phone',
    remark: '',
    index: null, 
  },	
  email: {
    name: 'Email',
    remark: '',
    index: null, 
  },
}
// 1:1自定義參數址的 CSV 
export const PARAMETER_EXCRL_LABEL_DATA = {
  campaign: {
    name: 'Campaign',
    remark: '',
    index: null,
  },
}

export const UNABLE_TO_CRAWL_DATAT = '無法抓取，請檢查網址是否正確。'

export const DEFAULT_FILTER_VALUE = {
  code: '',
  createDateEnd: '',
  createDateStart: '',
  createKind: '0',
  destUrl: '',
  isEnabled: '2',
  pageSize: 10,
  tags: [],
  title: '',
}

export const getExcelLabelData = (createType) => {
  switch (createType) {
  case 'Parameter':
    return PARAMETER_EXCRL_LABEL_DATA
  case 'Auto':
  default:
    return INDIVIDUAL_EXCRL_LABEL_DATA
  }
}

