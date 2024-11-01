import { createAxios } from 'apis/axios'
import { specifyParameterFilter, specifyParameterFilterForSearch } from 'utils/apiParamsFilter'
import { fakeMemberData } from 'apis/fakeData/member'

const memberApi = {
  editUser: async (params) => {
    params = specifyParameterFilter(params)
    const result = await createAxios().post('/Member/EditUser', params)
    return result.data
  },

  enable: async (params) => {
    params = specifyParameterFilter(params)
    const result = await createAxios().post('/Member/Enable', params)
    return result.data
  },

  getUser: async () => {
    return fakeMemberData.getUser
  },

  switchProject: async (params) => {
    params = specifyParameterFilterForSearch(params)
    const result = await createAxios().get(`/Member/Switch/${params.projectId}`, params)
    return result.data
  },

  login: async (params) => {
    // params = specifyParameterFilter(params)
    // const result = await createAxios().post('/Member/Login', params)
    // return result.data
    return fakeMemberData.login
  },

  logout: async () => {
    const result = await createAxios().get('/Member/Logout')
    return result.data
  },

  forgetPassword: async (params) => {
    params = specifyParameterFilter(params)
    const result = await createAxios().post('/Member/sendForgetPassword', {
      ...params,
      returnUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/login/resetPassword`,
      activateUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/login/activate`,
    })
    return result.data
  },

  resetPassword: async (params) => {
    params = specifyParameterFilter(params)
    const result = await createAxios().post('/Member/ResetPassword', params)
    return result.data
  },

  resetPasswordByLogin: async (params) => {
    params = specifyParameterFilter(params)
    const result = await createAxios().post('/Member/ResetPasswordByLogin', params)
    return result.data
  },
}

export default memberApi