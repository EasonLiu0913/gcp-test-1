import { createAxios } from 'apis/axios'
import { specifyParameterFilter, specifyParameterFilterForSearch } from 'utils/apiParamsFilter'

const application = {

  /**
   * 狀態 : 未使用 API
   * @async
   * @function get 取得申請狀態選項
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
  getStatusSelectList: async () => {
    const result = await createAxios().post('/Application/GetStatusSelectList')
    return result.data
  },

  /**
   * @async
   * @function get 取得成效
   * @param { object } params
   * @param { number } params.domain - 品牌
   * @param { number } params.status - 狀態(待審核: 0|Infra設定中: 1|駁回: 2|通過: 3)
   * @param { string } params.email - Email
   * 
   * // response 200
   * @returns {
   *   {
   *      data: {
   *        pageNumber: number,
   *        pageSize: number,
   *        pagedList: [{
   *          brandDomain: string,
   *          brandName: string,
   *          createDate: string,
   *          email: string,
   *          id: number,
   *          memberId: string,
   *          modifyDate: string,
   *          name: string,
   *          status: number,
   *          statusDesc: string
   *          testUrl: string
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
  get: async (params = {}, page = 1) => {
    params.page = page
    params = specifyParameterFilterForSearch(params)
    const result = await createAxios().post('/Application/Get', params)
    return result.data
  },

  /**
   * @async
   * @function create 建立申請單(申請短網址服務)
   * @param { object } params
   * @param { number } params.brandDomain - 品牌 Domain
   * @param { number } params.status - 申請狀態(0:待審|1:設定中|2:駁回|3:通過)
   * @param { string } params.email - Email
   * @param { string } params.name - 申請人姓名
   * @param { string } params.brandName - 品牌名稱
   * 
   * // response 200
   * @returns {
   *   {
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
  create: async (params) => {
    params = specifyParameterFilter(params)
    const result = await createAxios().post('/Application/Create', params)
    return result.data
  },
  
  /**
   * @async
   * @function edit 編輯申請單
   * @param { object } params
   * @param { number } params.brandDomain - 品牌 Domain
   * @param { number } params.status - 申請狀態(0:待審|1:設定中|2:駁回|3:通過)
   * @param { string } params.id - 編號
   * @param { string } params.name - 申請人姓名
   * @param { string } params.brandName - 品牌名稱
   * 
   * // response 200
   * @returns {
   *   {
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
  edit: async (params) => {
    params = specifyParameterFilter(params)
    const result = await createAxios().post('/Application/Edit', params)
    return result.data
  },
}
export default application