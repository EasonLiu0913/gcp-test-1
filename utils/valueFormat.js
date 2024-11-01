export const convertToOptionsFormat = (
  originOptions, labelKey, valueKey,
) => {
  let options = []
  
  if (Array.isArray(originOptions)) {
    options = originOptions.map((option) => {
      if (option[labelKey] !== void 0 && option[valueKey] !== void 0) {
        const omitOption = $omit(option, [labelKey, valueKey])
        return {
          ...omitOption,
          label: option[labelKey],
          value: option[valueKey],
        }
      } else {
        return option
      }
    })
  } else {
    options = Object.keys(originOptions || {}).map((type) => ({
      label: originOptions[type],
      value: type,
    }))
  }
  
  return options
}

// 數字格式，過濾非數字字元，只留下數字
export const numberFormat = (str) => {
  return parseInt(str.toString().replace(/[^0-9]/g, ''))
}

// 千分位顯示，將數字加入","
export const thousandthsFormat = (num) => {
  if (isNaN(num)) return 'NaN'
  let numStr = num.toString()
  let [intPart, decPart] = numStr.split('.')
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decPart ? `${intPart}.${decPart}` : intPart
}

// 貨幣格式: 可傳入金額、貨幣幣別
export const moneyFormat = (num, currencyValue = null) => {
  if (Boolean(num) === false) return '0'

  const numberRegex = /(\d+)(\.?\d*)/g
  return num.toString('zh', currencyValue && {
    style: 'currency',
    currency: currencyValue, 
  }).replace(numberRegex, (
    match, number, decimal,
  ) => {
    if (decimal) {
      const formatNum = new Intl.NumberFormat().format(number)
      return formatNum + decimal
    } 
    return new Intl.NumberFormat().format(match)
  })
}

// 過濾 \r, \n, \t
export const removeTabsAndNewlines = (str) => {
  return str.replace(/[\t\n\r]/g, '')
}