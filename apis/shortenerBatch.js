import { createAxios } from 'apis/axios'
import { specifyParameterFilter, specifyParameterFilterForSearch } from 'utils/apiParamsFilter'

const shortenerBatch = {
  get: async (params = {}, page = 1) => {
    params.page = page
    params = specifyParameterFilterForSearch(params)
    const result = await createAxios().post('/ShortenerBatch/Get', params)
    return result.data
  },

  export: async (params) => {
    params = specifyParameterFilter(params)
    const result = await createAxios().get(`/ShortenerBatch/Export/${params.id}`, { responseType: 'blob' })
    return result.data
  },

  downloadSampleFile: async () => {
    const result = await createAxios().get('/ShortenerBatch/DownloadSampleFile', { responseType: 'blob' })
    return result.data
  },

  /**
   * @function create 量產上傳
   * 
   * // response 200 / 400
   * @returns {
   *   {
   *      success: boolean,
   *      message: string,
   *      data: []
   *   }
   * }
   * 
   * 
   * 在資料進入後端前，統一進行資料過濾，以防遺漏
   * params 資料結構 & 預先過濾處理
   * {
   *    batchName: 'string',
   *    batchPairInfos: [], // csv data
   *  }
   *  
   *  batchPairInfos 資料過濾定義不明，並無開會一一列舉，目前已知規則
   *  1. CSV範本上列舉規則(字串長度、格式)，已透過 react-hook-form 處理
   *     相關驗證條件請查看 utils/hookFormValidates.js 中
   *  2. 字串一率過濾前後空白
   *  3. 時間統一格式
   *  4. "目標網址" URL 需將欄位中UTM資料覆寫回 "目標網址" 中
   * 
   *  batchPairInfos item 將透過 specifyParameterFilter 統一進行以上4點
   */
  create: async (params) => {
    let data = {
      // 2. 字串一率過濾前後空白
      batchName: params.batchName.trim(),
      batchPairInfos: [],
    }

    if (Array.isArray(params.batchPairInfos)) {
      params.batchPairInfos.map(item => {
        let rowData = {}
        for (let key in item) {
          rowData[key] = item[key].value
        }
        rowData = specifyParameterFilter(rowData)
        data.batchPairInfos.push(rowData)
      })
    }

    const result = await createAxios().post('/ShortenerBatch/Create', data)
    return result.data
  },
  
  delete: async (params) => {
    const result = await createAxios().delete(`/ShortenerBatch/Delete/${params.id}`)
    return result.data
  },
}

export default shortenerBatch