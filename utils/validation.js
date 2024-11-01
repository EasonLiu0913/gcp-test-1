import dayjs from 'dayjs'
import $isEmpty from 'lodash/isEmpty'
import $isString from 'lodash/isString'

const NUMBER_PATTERN = /^[0-9]*$/
const POSITIVE_INTEGER = /^(0|[1-9][0-9]*)$/
const POSITIVE_INTEGER_INCLUDE_ZERO = /^\+?[1-9][0-9]*$|^(0|[1-9][0-9]*)$/
const ENGLISH_NUMBER_STRING = /^[A-Za-z0-9]+$/
const CHINESE = /[\u4e00-\u9fa5]/

// 此處 URL_PATH 規則配合後端，後端為安全性考量與系統穩定等考量，不允許常規允許的 "-" 和 "|"，所以於2024/7/9將兩個符號由規則中剃除
// 更改規則前，請先與後端確認跳轉規則允許字符，避免可輸入不可新建、可新建不可跳轉、可跳轉無法取值紀錄...等問題
const URL_PATH = /^[\w\u4e00-\u9fa5]+$/
const FULL_WIDTH_CHAR = /[ａ-ｚＡ-Ｚ０-９]/
// special string also include space and full width
const SPECIAL_STRING = /[^\u00BF-\u1FFF\u2C00-\uD7FF\w]+|[\_]+/
const EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const TAIWAN_PHONE_PATTERN = /^09\d{8}$/
const TAIWAN_PHONE_PATTERN_TWO = /^9\d{8}$/
const TAIWAN_PHONE_PATTERN_FREE = /^08\d{8}$/
const TAIWAN_IDENTITY_CARD_NO = /^[A-Z]{1}\d{9}$/

export const rules = {
  required: (val) => Boolean(val),
  requiredString: (val) => $isString(val) && !!val.trim(),
  requiredObject: (item) => $isEmpty(item) ? false : Object.keys(item).every((key) => !!item[key]),
  requiredArray: (list) => $isEmpty(list) ? false : list.every((item) => !!item),
  requiredObjectArray: (list) => $isEmpty(list) ? false : list.every((item) => rules.requiredObject(item)),
  requiredBoolean: (val) => typeof val === 'boolean',

  regularString: (val) => !SPECIAL_STRING.test(val),
  mixinEnNumString: (val) => ENGLISH_NUMBER_STRING.test(val),
  jsonString: (val) => {
    try {
      JSON.parse(val)
      return true
    } catch {
      return false
    }
  },

  maxSize: (val, length) => val?.length <= length,
  minSize: (val, length) => val?.length >= length,
  rangeSize: (
    min, max, val,
  ) => val?.length >= min && val?.length <= max,
  mustSize: (val, length) => val?.length === length,

  maxNumber: (max, val) => val <= max,
  rangeNumber: (
    min, max, val,
  ) => val >= min && val <= max,
  naturalNumber: (val) => POSITIVE_INTEGER.test(val),
  includeZeroNaturalNumber: (val) => POSITIVE_INTEGER_INCLUDE_ZERO.test(val),
  patternNumber: (val) => NUMBER_PATTERN.test(val),

  // String date
  date: (val) => /^-?[\d]+\/[0-1]\d\/[0-3]\d$/.test(val),
  time: (val) => /^([0-1]?\d|2[0-3]):[0-5]\d$/.test(val),
  dateTime: (val) => /^\d{4}-\d{2}-\d{2}$/.test(val) || /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(val) || /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(val),
  unRequiredDateTime: (val) => /^\d{4}-\d{2}-\d{2}$/.test(val) || /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(val) || /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(val),
  fullTime: (val) => /^([0-1]?\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(val),
  timeOrFullTime: (val) => /^([0-1]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(val),

  // Date date
  validDate: (val) => dayjs(val).isValid(),
  rangeDate: (startVal, endVal) => !dayjs(startVal).isSame(dayjs(endVal)),
  logicalRangeDate: (startVal, endVal) => !dayjs(startVal).isAfter(dayjs(endVal)),

  isDomain: (val) => typeof val !== 'string' ? false : /^(http:\/\/|https:\/\/)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/.test(val.trim()),

  isEmail: (val) => EMAIL_PATTERN.test(String(val.trim()).toLowerCase()),
  // taiwan phone's rule, start by 09 or 9
  taiwanPhone: (val) => TAIWAN_PHONE_PATTERN.test(val) || TAIWAN_PHONE_PATTERN_TWO.test(val) || TAIWAN_PHONE_PATTERN_FREE.test(val),
  includeFullWidth: (val) => FULL_WIDTH_CHAR.test(val),
  includeChinese: (val) => CHINESE.test(val),
  taiwanIdentityCardNo: (val) => TAIWAN_IDENTITY_CARD_NO.test(val),

  urlPath: (val) => URL_PATH.test(val),
}
