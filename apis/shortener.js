import { createAxios } from 'apis/axios'
import { specifyParameterFilter, specifyParameterFilterForSearch } from 'utils/apiParamsFilter'

const shortener = {
  // 前端 2024/07/02 新增，用於內部高層查看不分品牌的所有短網址，不用於一般使用者
  getAll: async (params = {}, page = 1) => {
    params.page = page
    params = specifyParameterFilterForSearch(params)
    const result = await createAxios().post('/Shortener/GetAll', params)
    return result.data
  },

  get: async (params = {}, page = 1) => {
    params.page = page
    params = specifyParameterFilterForSearch(params)
    const result = await createAxios().post('/Shortener/Get', params)
    return result.data
  },
  
  // 2024/06/28 檢查：未使用
  // getById: async (params = {}) => {
  //   const result = await createAxios().get(`/Shortener/Get/${params.id}`)
  //   return result.data
  // },

  simpleGet: async (params = {}) => {
    // getById 的簡化版
    params = specifyParameterFilterForSearch(params)
    const result = await createAxios().get(`/Shortener/SimpleGet/${params.id}`)
    return result.data
  },

  create: async (params) => {
    params = specifyParameterFilter(params)
    const result = await createAxios().post('/Shortener/Create', params)
    return result.data
  },

  delete: async (params) => {
    params = specifyParameterFilter(params)
    const result = await createAxios().delete(`/Shortener/Delete/${params.id}`)
    return result.data
  },

  edit: async (params) => {
    params = specifyParameterFilter(params)
    const result = await createAxios().post('/Shortener/Edit', params)
    return result.data
  },

  // 2024/06/28 檢查：未使用
  // getPairInfos: async (params) => {
  //   const result = await createAxios().post('/Shortener/GetPairInfos', params)
  //   return result.data
  // },

  // 2024/06/28 檢查：未使用
  // createPairInfo: async (params) => {
  //   const result = await createAxios().post('/Shortener/CreatePairInfo', params)
  //   return result
  // },

  getOgMeta: async (params = {}) => {
    params = specifyParameterFilter(params)
    const result = await createAxios().post('/Shortener/GetOgMeta', params)
    return result.data
  },
}

export default shortener