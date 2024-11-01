import { createAxios } from 'apis/axios'
import { specifyParameterFilter, specifyParameterFilterForSearch } from 'utils/apiParamsFilter'

const plan = {
  get: async (params = {}) => {
    params = specifyParameterFilterForSearch(params)
    const result = await createAxios().post('/Plan/Get', params)
    return result.data
  },

  // 2024/06/28 檢查：未使用
  // getById: async (params = {}) => {
  //   const result = await createAxios().get(`/Plan/Get/${params.id}`)
  //   return result.data
  // },

  create: async (params) => {
    params = specifyParameterFilter(params)
    const result = await createAxios().post('/Plan/Create', params)
    return result.data
  },

  getPlanSelectList: async (params = {}) => {
    params = specifyParameterFilterForSearch(params, true)
    const result = await createAxios().get(`/Plan/GetPlanSelectList?${params}`)
    return result.data
  },
}

export default plan