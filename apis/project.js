import { createAxios } from 'apis/axios'
import { specifyParameterFilter, specifyParameterFilterForSearch } from 'utils/apiParamsFilter'
import { fakeProjectData } from 'apis/fakeData/project'

const project = {

  getBrandSelectList: async () => {
    const result = await createAxios().get('/Project/GetBrandSelectList')
    return result.data
  },

  getById: async (params = {}) => {
    params = specifyParameterFilterForSearch(params)
    const result = await createAxios().get(`/Project/GetBrandDomain/${params.id}`)
    return result.data
  },

  getMember: async () => {
    return fakeProjectData.getMember
  },

  getMemberAll: async () => {
    return fakeProjectData.getMemberAll
  },

  getBrandDomain: async (params, page = 1) => {
    params.page = page
    params = specifyParameterFilterForSearch(params)
    if (params.isEnabled === 'all') delete params.isEnabled
    const result = await createAxios().post('/Project/GetBrandDomain', params)
    return result.data
  },

  createBrandDomain: async (params) => {
    params = specifyParameterFilter(params)
    const result = await createAxios().post('/Project/CreateBrandDomain', params)
    return result.data
  },

  editBrandDomain: async (params) => {
    params = specifyParameterFilter(params)
    const result = await createAxios().post('/Project/EditBrandDomain', params)
    return result.data
  },

  deleteBrandDomain: async (params) => {
    params = specifyParameterFilter(params)
    const result = await createAxios().delete(`/Project/DeleteBrandDomain/${params.id}`)
    return result.data
  },

  inviteMember: async (params) => {
    params = specifyParameterFilter(params)
    const result = await createAxios().post('/Project/InviteMember', params)
    return result.data
  },

  resendInviteMail: async (params) => {
    params = specifyParameterFilter(params)
    const result = await createAxios().post('/Project/ResendInviteMail', params)
    return result.data
  },
}

export default project