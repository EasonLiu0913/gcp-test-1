import { createAxios } from 'apis/axios'
import { specifyParameterFilterForSearch } from 'utils/apiParamsFilter'
import { fakeDashboardData } from 'apis/fakeData/dashboard'

const dashboard = {
  realTimeClick: async (params = []) => {
    const result = await createAxios().post('/Dashboard/RealTimeClick', params)
    return result.data
  },

  getGaAudienceClickAnalyze: async (params = {}, page) => {
    params.page = page
    params = specifyParameterFilterForSearch(params)
    const result = await createAxios().post('/Dashboard/GetGaAudienceClickAnalyze', params)
    return result.data
  },

  getKeywordCount: async (params = {}) => {
    params = specifyParameterFilterForSearch(params)
    const result = await createAxios().get(`/Dashboard/GetKeywordCount/${params.keyword}`)
    return result.data
  },

  getSingleCreated: async () => {
    // const result = await createAxios().get('/Dashboard/GetSingleCreated')
    // return result.data
    return fakeDashboardData.getSingleCreated
  },

  getBatchCreated: async () => {
    // const result = await createAxios().get('/Dashboard/GetBatchCreated')
    // return result.data
    return fakeDashboardData.getBatchCreated
  },

  getIndividualCreated: async () => {
    // const result = await createAxios().get('/Dashboard/GetIndividualCreated')
    // return result.data
    return fakeDashboardData.getIndividualCreated
  },

  getTotalClick: async () => {
    const result = await createAxios().get('/Dashboard/GetTotalClick')
    return result.data
  },

  last24HoursTracking: async (params = {}) => {
    // params = specifyParameterFilterForSearch(params)
    // const result = await createAxios().post('/Dashboard/Last24HoursTracking', params)
    // return result.data
    return fakeDashboardData.last24HoursTracking
  },

  getlast24HoursTracking: async () => {
    // const result = await createAxios().get('/Dashboard/Last24HoursTracking')
    // return result.data
    return fakeDashboardData.last24HoursTracking
  },

  trackingByCreateDays: async (params = {}) => {
    // params = specifyParameterFilterForSearch(params)
    // const result = await createAxios().post('/Dashboard/TrackingByCreateDays', params)
    // return result.data
    return fakeDashboardData.trackingByCreateDays
  },

  /**
   * 狀態 : 未使用 API
   * @async
   * @function post 取得日期範圍內點擊前幾筆及總點擊數
   * @param { object } params
   * @param { number } params.page - 第幾頁
   * @param { number } params.pageSize - 每頁撈幾筆
   * @param { string } params.limitTotalQty - 取得總筆數限制
   * @param { string } params.createKind - 短網址類別(單一:0|量產:1|一比一:2)
   * @param { string } params.createDateSortBy - 依照建立日期排序(ASC|DESC)
   * @param { string } params.clickQtySortBy - 依照點擊數排序(ASC|DESC)
   * @param { string } params.title - 標題
   * @param { string } params.code - 短網址代碼
   * @param { string } params.destUrl - 目標網址
   * @param { string } params.utmSource - 廣告來源
   * @param { string } params.utmMedium - 廣告媒介
   * @param { string } params.utmCampaign - 廣告活動
   * @param { string } params.startDate - 起日(查詢建立時間的時間區間)
   * @param { string } params.endDate - 迄日(查詢建立時間的時間區間)
   * @param { string } params.startHour - 起始時(查詢建立時間的時間區間中的小時) 例如23點
   * @param { string } params.endHour - 結束時(查詢建立時間的時間區間中的小時) 例如23點
   * @param { string } params.expiryDateStart - 有效期限，查詢範圍起始日
   * @param { string } params.expiryDateEnd - 有效期限，查詢範圍結束日
   * @param { string } params.tags - 標籤
   * 
   * // response 200
   * @returns {
   *   {
   *      data: { object },
   *      message: string,
   *      success: boolean
   *   }
   * }
   * 
   * // response 400
   * @returns {
   *   {
   *      message: string,
   *      success: boolean,
   *      errorNo: number,
   *   }
   * }
   */
  trackingByClickedDaysAndTotal: async (params = {}) => {
    // params = specifyParameterFilterForSearch(params)
    // const result = await createAxios().post('/Dashboard/TrackingByClickedDaysAndTotal', params)
    return fakeDashboardData.trackingByClickedDaysAndTotal
  },
}
export default dashboard