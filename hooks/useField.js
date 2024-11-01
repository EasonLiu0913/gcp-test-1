import {
  useCallback,
  useState,
  useEffect,
} from 'react'
import { isEqualType, changeValueType } from 'utils/util'
import { dateFormat } from 'utils/date'
import { useError } from 'context/ErrorContext'

/**
 * 欄位資訊 fieldData (require): array  
 * 欄位所需的下拉選單 options (optional): object 
 * 目前已有 Options => 
 *   需要取得下拉選單API needInitializeMenuFromApi: Boolean
 *   從API取得預設欄位的值 defaultValueFn: function 
 *   資料準備完畢 isReady: Boolean
 *   資料準備完畢時打的callback onReady: function
 */
export const useField = (fieldData, options = {}) => {
  const [initialFieldInfo, setInitialFieldInfo] = useState([])
  const [fieldInfo, setFieldInfo] = useState(fieldData)
  const [isReady, setIsReady] = useState(false)
  const { reportError } = useError()
  
  const handleFieldChange = useCallback((value, name) => {
    setFieldInfo((prev) => prev.map(field => field.name === name ? {
      ...field,
      value,
    } : field))
  }, [])

  const getFieldMenuAndUpdateMenu = async () => {
    try {
      const fieldMenuApiInfo = fieldInfo.filter(el => el.menuApiFunc)

      if (fieldMenuApiInfo.length === 0) {
        throw 'Need to initialize the menu but no API provided.'
      }

      const dropdowns = await Promise.all(fieldMenuApiInfo.map(async ({ name, menuApiFunc }) => {
        const result = await menuApiFunc()
        const { success, data } = result.data
        if (!success) return reportError({ errorNo: result.errorNo || 9999 })
        return {
          fieldName: name,
          fieldMenu: data,
        }
      }))

      setFieldInfo( prev => {
        let updateDropdownMenu = prev.map(el => {
          const dropdownMenu = dropdowns.find(dropdown => dropdown.fieldName === el.name)?.fieldMenu

          if (el.defaultSelectedAll) {
            el.value = ['all', ...dropdownMenu.map(option => option.name)]
          }

          if (el.options?.length === 0 && dropdownMenu) {
            return {
              ...el,
              options: el.needAllButton ? [
                {
                  name: 'all',
                  label: '全部', 
                },
                ...dropdownMenu,
              ] : dropdownMenu,
            }
          }

          return el
        })
        // 儲存一份初始化資料(含從API取得的下拉選單)，為了重置資料使用
        setInitialFieldInfo(updateDropdownMenu)
        return updateDropdownMenu
      })

    } catch (error) {
      console.log('error', error)
    }
  }

  const getAndSetFieldValueFromAPI = async () => {
    try {
      const result = await options.defaultValueFunc()
      const { success, data } = result.data
      if (!success) throw result
      setFieldInfo( prev => {
        return prev.map(el => {
          if (el.apiName && data[el.apiName]) {
            return {
              ...el,
              value: data[el.apiName],
            }
          }
          return el
        })
      })
    } catch (error) {
      console.log('api error in getAndSetFieldValueFromAPI function', error)
    }
  }

  const handleFieldReset = useCallback(() => {
    setFieldInfo(initialFieldInfo)
  }, [initialFieldInfo])

  const setInitialDataFromNow = () => {
    setInitialFieldInfo(fieldInfo)
  }

  // 將fieldInfo欄位的values，整理為API所需的參數物件
  const apiParams = () => {
    const params = fieldInfo.reduce((acc, {
      customApiSubmmitType, value, apiName, type,
    }) => {
      // 將value的型別，轉換成API要求的型別
      if (customApiSubmmitType && !isEqualType(value, customApiSubmmitType)) {
        value = value ? changeValueType(value, customApiSubmmitType) : null
      }

      if (type === 'dateRangePicker' ) {
        const [startName, endName] = apiName.split(',')
        const [startDate, endDate] = value
        
        acc[startName] = startDate ? dateFormat(startDate) : null
        acc[endName] = endDate ? dateFormat(endDate) : null
        return acc
      }

      acc[apiName] = value
      return acc
    }, {})
    return params
  }

  useEffect(() => {
    let promiseArray = []

    // 如果有下拉選單的話，取得並更新下拉選單
    if (options.needInitializeMenuFromApi) {
      promiseArray.push(getFieldMenuAndUpdateMenu())
    }
    if (options.defaultValueFunc && typeof options.defaultValueFunc === 'function') {
      promiseArray.push(getAndSetFieldValueFromAPI())
    }

    Promise.all(promiseArray).then(() => {
      setIsReady(true)
      if (options.onReady) options.onReady()

      // 儲存一份初始化資料，為了重置資料使用
      if (promiseArray.length === 0) setInitialFieldInfo(fieldInfo)
    })
  }, [])

  return {
    fieldInfo,
    isReady,
    apiParams,
    handleFieldChange,
    handleFieldReset,
    setInitialDataFromNow,
  }
}
