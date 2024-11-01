import { createAxios } from 'apis/axios'
import { rules } from 'utils/validation'
import { specifyParameterFilter, specifyParameterFilterForSearch } from 'utils/apiParamsFilter'

const shortenerIndividual = {
  getList: async (params = {}) => {
    params = specifyParameterFilterForSearch(params)
    const result = await createAxios().post('/ShortenerIndividual/Get', params)
    return result.data
  },
  
  getInfo: async (params = {}) => {
    params = specifyParameterFilterForSearch(params)
    const result = await createAxios().get(`/ShortenerIndividual/Get/${params.id}`)
    return result.data
  },

  create: async (params = {}) => {
    params = specifyParameterFilter(params)
    const result = await createAxios().post(
      '/ShortenerIndividual/Create',
      {
        CampaignName: params.campaignName,
        CampaignStartDate: params.campaignStartDate,
        OneOnOneFile: params.oneOnOneFile,
        PairInfo: {
          CreateKind: 2, 
          DestUrl: params.destUrl,
          Title: params.title,
          Code: params.code,
          Tags: params.tags,
          ExpiryDate: params.expiryDate,
          IsEnabled: params.isEnabled,
          IsGetParams: params.isGetParams,
          UtmSource: params.utmSource,
          UtmMedium: params.utmMedium,
          UtmCampaign: params.utmCampaign,
          UtmTerm: params.utmTerm,
          UtmContent: params.utmContent,
          MetaTitle: params.metaTitle,
          MetaDesc: params.metaDesc,
          MetaImage: params.metaImage,
          MetaSiteName: params.metaSiteName,
        },
      },
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    return result.data
  },

  edit: async (params = {}) => {
    params = specifyParameterFilter(params)
    let data = {
      CampaignName: params?.campaignName,
      CampaignStartDate: params?.campaignStartDate,
      OneOnOneFile: params?.oneOnOneFile,
      Id: params.id,
      PairInfo: {
        Id: params.pairInfoId,
        CreateKind: 2,
        DestUrl: params.destUrl,
        Title: params.title,
        Code: params.code,
        Tags: params.tags,
        ExpiryDate: params.expiryDate,
        IsEnabled: params.isEnabled,
        IsGetParams: params.isGetParams,
        UtmSource: params.utmSource,
        UtmMedium: params.utmMedium,
        UtmCampaign: params.utmCampaign,
        UtmTerm: params.utmTerm,
        UtmContent: params.utmContent,
        MetaTitle: params.metaTitle,
        MetaDesc: params.metaDesc,
        MetaImage: params.metaImage,
        MetaSiteName: params.metaSiteName,
      },
    }

    if (!rules.required(data.OneOnOneFile)){
      delete data.OneOnOneFile
      delete data.CampaignName
    }

    const result = await createAxios().post(
      '/ShortenerIndividual/Edit',
      data,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    return result.data
  },

  createByParameter: async (params = {}) => {
    params = specifyParameterFilter(params)
    const data = {
      Parameters: params.parameters,
      PairInfo: {
        CreateKind: 2, 
        DestUrl: params.destUrl,
        Title: params.title,
        Code: params.code,
        Tags: params.tags,
        ExpiryDate: params.expiryDate,
        IsEnabled: params.isEnabled,
        IsGetParams: params.isGetParams,
        UtmSource: params.utmSource,
        UtmMedium: params.utmMedium,
        UtmCampaign: params.utmCampaign,
        UtmTerm: params.utmTerm,
        UtmContent: params.utmContent,
        MetaTitle: params.metaTitle,
        MetaDesc: params.metaDesc,
        MetaImage: params.metaImage,
        MetaSiteName: params.metaSiteName,
      },
    }
    const result = await createAxios().post('/ShortenerIndividual/CreateByParameter',
      data)
    return result.data
  },
  
  editByParameter: async (params = {}) => {
    params = specifyParameterFilter(params)
    let data = {
      Id: params.id,
      PairInfo: {
        CreateKind: 2,
        DestUrl: params.destUrl,
        Title: params.title,
        Code: params.code,
        Tags: params.tags,
        ExpiryDate: params.expiryDate,
        IsEnabled: params.isEnabled,
        IsGetParams: params.isGetParams,
        UtmSource: params.utmSource,
        UtmMedium: params.utmMedium,
        UtmCampaign: params.utmCampaign,
        UtmTerm: params.utmTerm,
        UtmContent: params.utmContent,
        MetaTitle: params.metaTitle,
        MetaDesc: params.metaDesc,
        MetaImage: params.metaImage,
        MetaSiteName: params.metaSiteName,
        Id: params.pairInfoId,
      },
      parameters: params.parameters,
      IsUpdateList: true,
    }

    const result = await createAxios().post('/ShortenerIndividual/EditByParameter',
      data)
    return result.data
  },

  downloadSampleFile: async () => {
    const result = await createAxios().get('/ShortenerIndividual/DownloadSampleFile', { responseType: 'abc' })
    return result.data
  },

  export: async (params) => {
    params = specifyParameterFilter(params)
    const result = await createAxios().get(`/ShortenerIndividual/Export/${params.id}`, { responseType: 'blob' })
    return result.data
  },

  delete: async (params) => {
    const result = await createAxios().delete(`/ShortenerIndividual/Delete/${params.id}`)
    return result.data
  },
}

export default shortenerIndividual