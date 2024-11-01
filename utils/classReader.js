import { styleSwitch } from 'config/styleList'

const typeChecker = (param, checker) => {
  if (checker === 'array') return Array.isArray(param)
  if (typeof param === checker) return true
  return false
}

const checkIsFakeString = (scssStyle = 'CommonStyle', param) => {
  if (param.indexOf('{') !== -1) {
    const myKey = param.substring(param.indexOf('{') + 1, param.indexOf(':')).replace(/"/g, '')
    const myValue = param.substring(param.indexOf(':') + 1, param.lastIndexOf('}')).replace(/"/g, '')
    const newObj = {
      myKey: myKey,
      myValue: myValue,
    }
    return paramObjHandler(newObj)
  }
  if (param[0] === '[') {
    const newArray = param.substring(1, param.length - 1).split(',')
    return [true, paramHandler(scssStyle, newArray)]
  }
  return [false, param]
}

const paramHandler = (scssStyle, param) => {
  if (typeChecker(param, 'array')) {
    return param.map((item) => paramHandler(scssStyle, item)).join(' ')
  } else if (typeChecker(param, 'object')) {
    return paramObjectInObjectHandler(scssStyle, param)[1]
  } else if (typeChecker(param, 'string')) {

    if (checkIsFakeString(scssStyle, param)[0])
      return checkIsFakeString(scssStyle, param)[1]
    return paramStringHandler(scssStyle, param)
  }
}

const paramStringHandler = (scssStyle, param) => {
  const checkParams = param.split(' ')
  if (checkParams.length > 1) {
    return checkParams.map((param) => paramHandler(scssStyle, param)).join(' ')
  } else {
    if (checkParams[0].indexOf('{') !== -1) {
      if (checkIsFakeString(param)) return checkIsFakeString(param)[1]
    }
    if (checkParams[0].indexOf(',') !== -1) {
      return checkParams[0].split(',').map((param) => paramHandler(scssStyle, param)).join(' ')
    }
    try {
      const result = styleSwitch[scssStyle][checkParams[0]]
      if (!result && scssStyle === 'CommonStyle' && param !== 'true' && param !== 'false') return param
      return (!result) ? '' : result
    } catch (e) {
      return param
    }
  }
}

const paramObjHandler = (obj) => {
  if (!obj.myKey) return [false, '']
  if (obj.myValue === true || obj.myValue === 'true')
    return [true, paramStringHandler('CommonStyle', obj.myKey)]
  const styles = obj.myKey.split(' ')
  return [true, styles.map((style) => paramHandler(style, obj.myValue)).join(' ')]
}

const paramObjectInObjectHandler = (scssStyle, param) => {
  if (param === undefined || param === null || !Object.values(param)[0]) return [false, '']
  return [true, paramStringHandler(scssStyle, Object.keys(param)[0])]
}

const classReader = (...classes) => {
  return classes
    .map((item) => {
      if (typeChecker(item, 'string')) {
        return paramStringHandler('CommonStyle', item)
      } else if (typeChecker(item, 'object')) {
        return Object.entries(item)
          .map((ObjEntries) => {
            return paramObjHandler({
              myKey: ObjEntries[0],
              myValue: ObjEntries[1],
            })[1]
          })
          .join(' ')
      }
    })
    .join(' ')
}

export default classReader
