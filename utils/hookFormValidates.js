
import { FORM_VALIDATES_MSG } from 'config/formValidates'
import { lastSegmentOfURL, getHostname } from 'utils/util'
import { rules } from 'utils/validation'

export const hookFormValidates = (props) => {

  // 可所需自訂參數
  const brandDomain = props?.brandDomain

  return {
    //   code: {
    //     required: (val) => rules.required(val) || FORM_VALIDATES_MSG.urlOrCode,
    //     isBrandNameOrCode: (val) => (rules.isDomain(val) && brandDomain === getHostname(val) && lastSegmentOfURL(val).length > 1) || (!rules.isDomain(val) && rules.mixinEnNumString(val)) || FORM_VALIDATES_MSG.brandInvalid, 
    //   },
    
    // 使用者資訊
    name: { required: (val) => rules.requiredString(val) || FORM_VALIDATES_MSG.nameRequired },
    userName: { required: (val) => rules.requiredString(val) || FORM_VALIDATES_MSG.userNameRequired },
    pinWord: { required: (val) => rules.requiredString(val) || FORM_VALIDATES_MSG.pinRequired },
    pinCheckWord: { required: (val) => rules.requiredString(val) || FORM_VALIDATES_MSG.pinCheckRequired },
    company: { required: (val) => rules.requiredString(val) || FORM_VALIDATES_MSG.companyRequired },
    role: { required: (val) => rules.required(val) || FORM_VALIDATES_MSG.notPermissions },
    
    // 網域 / 網址
    destUrl: {
      required: (val) => rules.requiredString(val) || FORM_VALIDATES_MSG.urlRequired,
      isDomain: (val) => rules.isDomain(val) || FORM_VALIDATES_MSG.urlWrongFormat,
    },
    urlPath: { required: (val) => !rules.required(val) || (rules.required(val) && rules.urlPath(val)) || FORM_VALIDATES_MSG.urlPath }, 
    
      
    // 短網址/代碼
    code: { required: (val) => !rules.required(val) || (!rules.isDomain(val) && rules.required(val)) || (rules.isDomain(val) && lastSegmentOfURL(val).length > 0) || FORM_VALIDATES_MSG.brandInvalid }, 
    parametersCode: { required: (val) => rules.required(val) || FORM_VALIDATES_MSG.codeRequired },
    codeRequired: {
      required: (val) => rules.required(val) || FORM_VALIDATES_MSG.urlOrCode,
      isBrandNameOrCode: (val) => (!rules.isDomain(val) && rules.required(val)) || (rules.isDomain(val) && lastSegmentOfURL(val).length > 0) || FORM_VALIDATES_MSG.brandInvalid, 
    },
    
    // 品牌
    brandName: { required: (val) => rules.requiredString(val) || FORM_VALIDATES_MSG.brandRequired },
    brandNameSelect: { required: (val) => rules.required(val) || FORM_VALIDATES_MSG.brandSelectRequired },
    brandDomain: {
      maxSize: (val) => rules.maxSize(val, 20) || FORM_VALIDATES_MSG.brandExceedsLimit,
      required: (val) => rules.requiredString(val) || FORM_VALIDATES_MSG.domainRequired,
    },
     
    // 方案
    planName: { required: (val) => rules.requiredString(val) || FORM_VALIDATES_MSG.planNameRequired },
    planId: { required: (val) => rules.required(val) || FORM_VALIDATES_MSG.planRequired },
    planStartDate: { required: (val) => rules.required(val) || `服務${FORM_VALIDATES_MSG.startDate}` },
    planEndDate: { required: (val) => rules.required(val) || `服務${FORM_VALIDATES_MSG.endDate}` },
    planContent: { required: (val) => rules.requiredArray(val) || FORM_VALIDATES_MSG.planContentRequired },
    planPrice: {
      required: (val) => rules.required(val) || FORM_VALIDATES_MSG.planPriceRequired,
      isNumber: (val) => rules.naturalNumber(val) || FORM_VALIDATES_MSG.planPriceNaturalNumber,
    },
    
    // 一般日期
    startDate: { required: (val) => rules.required(val) || FORM_VALIDATES_MSG.startDate },
    endDate: { required: (val) => rules.required(val) || FORM_VALIDATES_MSG.endDate },
      
    // Email
    email: {
      required: (val) => rules.requiredString(val) || FORM_VALIDATES_MSG.emailRequired,
      isEmail: (val) => rules.isEmail(val) || FORM_VALIDATES_MSG.emailWrongFormat,
    },
    emailSearch: { isEmail: (val) => !rules.requiredString(val) || rules.isEmail(val) || FORM_VALIDATES_MSG.emailWrongFormat },
    
    // 角色
    roleName: { required: (val) => rules.requiredString(val) || FORM_VALIDATES_MSG.roleNameRequired },
    roleCode: { required: (val) => rules.requiredString(val) || FORM_VALIDATES_MSG.roleCodeRequired },
    roleDesc: { required: (val) => rules.requiredString(val) || FORM_VALIDATES_MSG.roleDescRequired },
    isCheckOther: { requiredBoolean: (val) => rules.requiredBoolean(val) || FORM_VALIDATES_MSG.isCheckOtherRequired },
    
    // 到期日期
    expiryDate: { required: (val) => rules.required(val) || FORM_VALIDATES_MSG.expiryDateRequired },
    expiryStartDate: { required: (val) => rules.required(val) || FORM_VALIDATES_MSG.expiryStartDate },
    expiryEndDate: { required: (val) => rules.required(val) || FORM_VALIDATES_MSG.expiryEndDate },
     
    // UTM
    utmSource: { required: (val) => rules.requiredString(val) || FORM_VALIDATES_MSG.utmSourceRequired },
    utmMedium: { required: (val) => rules.requiredString(val) || FORM_VALIDATES_MSG.utmMediumRequired },
    utmCampaign: { required: (val) => rules.requiredString(val) || FORM_VALIDATES_MSG.utmCampaignRequired },
      
    // 行銷活動
    campaignName: { required: (val) => rules.requiredString(val) || FORM_VALIDATES_MSG.campaignNameRequired },
    campaignStartDate: { required: (val) => rules.required(val) || FORM_VALIDATES_MSG.campaignStartDateRequired },
      
    // 新增 / 編輯
    title: { required: (val) => rules.requiredString(val) || FORM_VALIDATES_MSG.titleRequired },
    tags: { required: (val) => rules.requiredArray(val) || FORM_VALIDATES_MSG.tagAtLeastOne },
    batchName: { required: (val) => rules.requiredString(val) || FORM_VALIDATES_MSG.batchNameRequired },
    filePath: { required: (val) => val.length || FORM_VALIDATES_MSG.nofilePath },
  }
}