import { createAxios } from 'apis/axios'
import { MAX_DATE, MIN_DATE } from 'config/date'
import { specifyParameterFilter, specifyParameterFilterForSearch } from 'utils/apiParamsFilter'

const analysis = {

  /**
   * @async
   * @function getEffect 取得成效
   * @param { object } params
   * @param { number } params.page - 目前頁數
   * @param { number } params.pageSize - 每頁筆數
   * @param { string } params.title - 標題
   * @param { string } params.code - 短網址代碼
   * @param { string } params.destUrl - 目標網址
   * @param { string } params.utmSource - 廣告來源 utm_source
   * @param { string } params.utmMedium - 廣告媒介 utm_medium
   * @param { string } params.utmCampaign - 廣告活動 utm_campaign
   * @param { string } params.createKind - 短網址類別(全部:''|單一:'0'|量產: '1'|一比一:'2')
   * @param { string } params.startDate - 建立區間(起)
   * @param { string } params.endDate - 建立區間(訖)
   * @param { string } params.expiryDateStart - 有效期限(到期日)區間(起)
   * @param { string } params.expiryDateEnd - 有效期限(到期日)區間(訖)
   * @param { array } params.tags - 標籤
   * 
   * // response 200
   * @returns {
   *   {
   *      data: {
   *        pageNumber: number,
   *        pageSize: number,
   *        pagedList: [{
   *          createDate: string,
   *          createKind: string,
   *          destUrl: string,
   *          imageUrl: string,
   *          pairInfoId: string,
   *          realTimeClick: number,
   *          shortUrl: string,
   *          tags: [string, string, ...],
   *          title: string,
   *          totalClick: number
   *        }],
   *        totalCount: number,
   *        totalPage: number
   *      },
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
  getEffect: async (params = {}, page) => {
    params.page = page
    // 針對後端所需時間格是進行填補，增加最大最小值
    if (!params.startDate) params.startDate = MIN_DATE
    if (!params.endDate) params.endDate = MAX_DATE

    params = specifyParameterFilterForSearch(params)
    const result = await createAxios().post('/Analysis/GetEffect', params)
    return result.data
  },

  /**
   * @async
   * @function exportEffect 匯出成效 CSV
   * @param { object } params
   * @param { number } params.page - 目前頁數
   * @param { number } params.pageSize - 每頁筆數
   * @param { string } params.title - 標題
   * @param { string } params.code - 短網址代碼
   * @param { string } params.destUrl - 目標網址
   * @param { string } params.utmSource - 廣告來源 utm_source
   * @param { string } params.utmMedium - 廣告媒介 utm_medium
   * @param { string } params.utmCampaign - 廣告活動 utm_campaign
   * @param { string } params.createKind - 短網址類別(全部:''|單一:'0'|量產: '1'|一比一:'2')
   * @param { string } params.startDate - 建立區間(起)
   * @param { string } params.endDate - 建立區間(訖)
   * @param { string } params.expiryDateStart - 有效期限(到期日)區間(起)
   * @param { string } params.expiryDateEnd - 有效期限(到期日)區間(訖)
   * @param { array } params.tags - 標籤
   * 
   * // response 200
   * @returns blob
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
  exportEffect: async (params = {}) => {
    params = specifyParameterFilter(params)
    const result = await createAxios().post(
      '/Analysis/ExportEffect', params, { responseType: 'blob' },
    )
    return result.data
  },

  /**
   * 排序只能指定一個欄位，若同時指定日期排序又指定點擊數排序，只有後者會生效
   * @async
   * @function trackingByDate 取得某一比每日點擊
   * @param { object } params
   * @param { number } params.qty - 取幾筆
   * @param { string } params.code - 短網址代碼
   * @param { string } params.createKind - 短網址類別(全部:''|單一:'0'|量產: '1'|一比一:'2')
   * @param { string } params.startDate - 日期區間(起)
   * @param { string } params.endDate - 日期區間(訖)
   * @param { string } params.createDateSortBy - 依照建立日期排序(ASC|DESC)
   * @param { string } params.clickQtySortBy - 依照點擊數排序(ASC|DESC)
   * 
   * // response 200
   * @returns {
   *   {
   *      data: [{
   *          clickQty: number,
   *          code: string,
   *          createKind: number,
   *          dataDate: string,
   *          destUrl: string,
   *          pairInfoId: string,
   *          secondUrl: string,
   *          shortUrl: string,
   *          title: string
   *        }],
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
  trackingByDate: async (params = {}) => {
    params = specifyParameterFilter(params)
    const result = await createAxios().post('/Analysis/TrackingByDate', params)
    return result.data
  },

  /**
   * 排序只能指定一個欄位，若同時指定日期排序又指定點擊數排序，只有後者會生效
   * @async
   * @function exportTrackingByDate 匯出某一筆每日點擊 CSV
   * @param { object } params
   * @param { number } params.qty - 取幾筆
   * @param { string } params.code - 短網址代碼
   * @param { string } params.createKind - 短網址類別(全部:''|單一:'0'|量產: '1'|一比一:'2')
   * @param { string } params.startDate - 日期區間(起)
   * @param { string } params.endDate - 日期區間(訖)
   * @param { string } params.createDateSortBy - 依照建立日期排序(ASC|DESC)
   * @param { string } params.clickQtySortBy - 依照點擊數排序(ASC|DESC)
   * 
   * // response 200
   * @returns blob
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
  exportTrackingByDate: async (params = {}) => {
    params = specifyParameterFilter(params)
    const result = await createAxios().post(
      '/Analysis/ExportTrackingByDate', { ...params }, { responseType: 'blob' },
    )
    return result.data
  },

  /**
   * @async
   * @function getGaAudience 取得GA點擊的受眾分析(Click, UU)
   * @param { object } params
   * @param { number } params.page - 取幾筆
   * @param { number } params.pageSize - 每頁筆數
   * @param { string } params.title - 標題
   * @param { string } params.code - 短網址代碼
   * @param { string } params.destUrl - 目標網址
   * @param { string } params.utmSource - 廣告來源 utm_source
   * @param { string } params.utmMedium - 廣告媒介 utm_medium
   * @param { string } params.utmCampaign - 廣告活動 utm_campaign
   * @param { string } params.createKind - 建立方式/短網址類別(全部:''|單一:'0'|量產: '1'|一比一:'2')
   * @param { string } params.startDate - 日期區間(起)
   * @param { string } params.endDate - 日期區間(訖)
   * 
   * // response 200
   * @returns {
   *   {
   *      data: {
   *        pageNumber: number,
   *        pageSize: number,
   *        pagedList:[{
   *          createDate: string,
   *          createKind: string,
   *          destUrl: number,
   *          imageUrl: string,
   *          pairInfoId: string,
   *          shortUrl: string,
   *          title: string,
   *          totalClick: number,
   *          uniqueUsers: number
   *        }],
   *        totalCount: number,
   *        totalPage: number,
   *      }
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
  getGaAudience: async (params = {}, page) => {
    params.page = page
    params = specifyParameterFilterForSearch(params)
    const result = await createAxios().post('/Analysis/GetGaAudience', params)
    return result.data
  },

  /**
   * @async
   * @function exportGaAudience 匯出受眾分析
   * @param { object } params
   * @param { number } params.page - 取幾筆
   * @param { number } params.pageSize - 每頁筆數
   * @param { string } params.title - 標題
   * @param { string } params.code - 短網址代碼
   * @param { string } params.destUrl - 目標網址
   * @param { string } params.utmSource - 廣告來源 utm_source
   * @param { string } params.utmMedium - 廣告媒介 utm_medium
   * @param { string } params.utmCampaign - 廣告活動 utm_campaign
   * @param { string } params.createKind - 建立方式/短網址類別(全部:''|單一:'0'|量產: '1'|一比一:'2')
   * @param { string } params.startDate - 日期區間(起)
   * @param { string } params.endDate - 日期區間(訖)
   * 
   * // response 200
   * @returns blob
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
  exportGaAudience: async (params = {}) => {
    params = specifyParameterFilter(params)
    const result = await createAxios().post(
      '/Analysis/ExportGaAudience', params, { responseType: 'blob' },
    )
    return result.data
  },

  /**
   * @async
   * @function getSiteHopperFootprints 取得網站跳要足跡(看A也看B)
   * @param { object } params
   * @param { number } params.page - 取幾筆
   * @param { number } params.pageSize - 每頁筆數
   * @param { string } params.code - 短網址代碼
   * @param { string } params.startDate - 日期區間(起)
   * @param { string } params.endDate - 日期區間(訖)
   * 
   * // response 200
   * @returns {
   *   {
   *      data: {
   *        pageNumber: number,
   *        pageSize: number,
   *        pagedList:[{
   *          clicked_domain: string,
   *          clicked_ourl: string,
   *          clicks: number,
   *          isSameDomain: boolean,
   *          meta_image: string,
   *          rank: number,
   *          title: string,
   *          uu: number,
   *        }],
   *        totalCount: number,
   *        totalPage: number,
   *      }
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
  getSiteHopperFootprints: async (params = {}) => {
    params = specifyParameterFilterForSearch(params)
    const result = await createAxios().post('/Analysis/GetSiteHopperFootprints', params)
    return result.data
  },

  /**
   * @async
   * @function getGaChtLabel 取得短網址中華標籤
   * @param { object } params
   * @param { number } params.page - 取幾筆
   * @param { number } params.pageSize - 每頁筆數
   * @param { string } params.code - 短網址代碼
   * @param { string } params.startDate - 日期區間(起)
   * @param { string } params.endDate - 日期區間(訖)
   * 
   * // response 200
   * @returns {
   *   {
   *      data: {
   *        pageNumber: number,
   *        pageSize: number,
   *        pagedList:[{
   *          chtTag: string,
   *          createKind: number,
   *          destUrl: string,
   *          firstBrandDomain: boolean,
   *          firstOurl: string,
   *          firstPairId: number,
   *          secondOurl: string,
   *          title: string,
   *          uniqueUsers: number,
   *        }],
   *        totalCount: number,
   *        totalPage: number,
   *      }
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
  getGaChtLabel: async (params = {}) => {
    params = specifyParameterFilter(params)
    const result = await createAxios().post('/Analysis/GetGaChtLabel', params)
    return result.data
  },
}
export default analysis