import { createAxios } from 'apis/axios'
import { specifyParameterFilter, specifyParameterFilterForSearch } from 'utils/apiParamsFilter'

const role = {
  get: async (params, page) => {
    params.page = page
    params = specifyParameterFilterForSearch(params, true)
    const result = await createAxios().get(`/Role/Get?${params}`)
    return result.data
  },

  getById: async (params) => {
    params = specifyParameterFilterForSearch(params)
    const result = await createAxios().get(`/Role/Get/${params.id}`)
    return result.data
  },

  getPageByRoleId: async (params) => {
    params = specifyParameterFilterForSearch(params)
    const result = await createAxios().get(`/Role/GetPage/${params.roleId}`)
    return result.data
  },

  getRoleSelectList: async () => {
    const result = await createAxios().get('/Role/GetRoleSelectList')
    return result.data
  },

  create: async (params) => {
    params = specifyParameterFilter(params)
    const result = await createAxios().post('/Role/Create', params)
    return result.data
  },

  edit: async (params) => {
    params = specifyParameterFilter(params)
    const result = await createAxios().post('/Role/Edit', params)
    return result.data
  },
}

export default role