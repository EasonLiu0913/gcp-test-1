import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { prevStep } from 'slices/stepperSlice'
import classReader from 'utils/classReader'
import { handleDateFormat, isAfterDate } from 'utils/date'
import { arrayMargeDuplicateData } from 'utils/util'
import { rules } from 'utils/validation'
import { DEFAULT_SIZES } from 'config/style'
import { useError } from 'context/ErrorContext'
import { MAX_DATE } from 'config/date'
import { MAXROW, BATCH_EXCRL_LABEL_DATA } from 'config/shortener'
import { FORM_VALIDATES_MSG, FORM_VALUE_MAX_LENGTH } from 'config/formValidates'
import shortenerBatchAPI from 'apis/shortenerBatch'
import Modal from 'common/Modal'
import Button from 'common/Button'
import { useRouter } from 'next/router'
import Papa from 'papaparse'
import ReactLoading from 'react-loading'

const FormTwo = ({
  getValues,
  handleSubmit, 
  setValue,  
}) => {

  const [isErrorDlgOpen, setIsErrorDlgOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch()
  const [data, setData] = useState([])
  const [tableLabel, setTableLabel] = useState([])
  const [tableKey, setTableKey] = useState([])
  const [tableRowHeightLine, setTableRowHeightLine] = useState([])
  const [tableLabelIllegal, setTableLabelIllegal] = useState([])
  const [tableItemIllegal, setTableItemIllegal] = useState([])
  const [tableExceedLimit, setTableExceedLimit] = useState(false)

  const { reportError } = useError()
  const router = useRouter()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      delete data.filePath
      let result = await shortenerBatchAPI.create(data)
      if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })
      router.push('/shortener/batch/create/finish')
    } catch (err) {
      reportError(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleErrorDlgClose = () => {
    setIsErrorDlgOpen(false)
  }

  const handlePrev = () => {
    dispatch(prevStep())
    setData([])
    setTableLabel([])
    setTableLabelIllegal([])
    setTableItemIllegal([])
    setTableExceedLimit(false)
    handleErrorDlgClose()
  }
  
  useEffect(() => {
    
    const file = getValues().filePath?.[0]
    if (!file) return

    // dispatch({ type: 'loading/openLoading' })
    Papa.parse(file, {
      encoding: 'Big5',
      complete: results => {

        // 指定有效資料起始行數
        let rowNumber = 0

        // 指定 Label 預設資料
        let labelData = BATCH_EXCRL_LABEL_DATA
        let labelArray = []
        let labelErrorArray = []

        // 判斷是否抓到有效的 Label，預設 false
        let labelStatus = false
        let labelKeyArray = []

        // 為了避免用戶誤傳過大檔案，導致前端迴圈執行過常造成記憶體/效能崩潰，限制只抓取前500行資料
        let labelForMax = results.data.length > MAXROW ? MAXROW : results.data.length

        // 抓出有效資料正確行數
        for (let i = 0 ; i < labelForMax ; i++) {

          // 當資料 row 都沒資料，跳過此次
          if (results.data[i].filter(el => el).length === 0){
            continue 
          }
          
          if (results.data[i].includes(labelData.sort.name)){
            rowNumber = i

            Object.keys(labelData).forEach(key => {
              labelKeyArray.push(key)
              labelArray.push(labelData[key])
              const rowName = `${labelData[key].name}${labelData[key].remark}`
              labelData[key].index = results.data[i].indexOf(rowName)
              if (labelData[key].index === -1) labelErrorArray.push(rowName)
            })
            
            // 500行內抓到有效 Label 資料起始位置，中斷抓取
            labelStatus = true
            break
          }
        }
      
        // 當上傳CSV缺少欄位時 or 前 500 行找不到必要欄位
        if (!labelStatus) {
          let allErrorData = []
          Object.keys(labelData).forEach(key => {
            const rowName = `${labelData[key].name}${labelData[key].remark}`
            allErrorData.push(rowName)
          })
          setTableLabelIllegal(allErrorData)
          return 
        }
     
        //  錯誤欄位
        setTableLabelIllegal(labelErrorArray)

        // 預覽正確欄位
        setTableLabel(labelArray)

        // 取得有效資料範圍
        let resultData = results.data.slice(rowNumber + 1)

        // 紀錄欄位錯誤訊息
        let itemIllegal = []
        
        // 紀錄資料欄位有錯誤的 row index，以便在顯示時 heightline row (背景反灰)          
        let rowHeightLine = []

        // 紀錄處理過的資料欄位 sort，用以判斷下一個 sort 是否有重複
        let rowSort = []

        // 宣告 data，有效資料將放進此變數中
        let csvData = []
        
        // 定義最大時間
        const maxTime = handleDateFormat({
          dateTime: MAX_DATE,
          format: 'YYYY/MM/DD 00:00:00',
        })

        let forMax = resultData.length

        for (let i = 0 ; i < forMax ; i++ ){

          // 避免非必要迴圈浪費效能 & 用戶等待時間
          if (csvData.length >= 100) {
            setTableExceedLimit(true)
            setIsErrorDlgOpen(true)
            break 
          }

          // 當資料 row 都沒資料，跳過此次
          if (resultData[i].filter(el => el).length === 0){
            forMax = forMax + 1 > resultData.length ? resultData.length : forMax + 1
            continue 
          }

          let tableItem = {}

          // 針對字串進行統一過濾
          labelKeyArray.map(key => {
            const rowName = `${labelData[key].name}${labelData[key].remark}`
            const value = rules.required(resultData[i][labelData[key].index]) ? resultData[i][labelData[key].index] : ''
            tableItem[key] = {
              value: value,
              viewValue: value,
              err: [], 
            }

            let regex = null
            let errorMsg = null
              
            switch (key) {
            case 'sort':
              if (!rules.patternNumber(value)) {
                errorMsg = `${rowName}只允許數字`
                tableItem[key].err.push(errorMsg)
                itemIllegal.push(errorMsg)
              } 

              if (rowSort.includes(value)){
                errorMsg = `${rowName}重複`
                tableItem[key].err.push(errorMsg)
                itemIllegal.push(errorMsg)
              }
              rowSort.push(value)

              break
            case 'destUrl':

              if (!rules.required(value) || !rules.requiredString(value)) {
                errorMsg = `${rowName}必填`
                tableItem[key].err.push(errorMsg)
                itemIllegal.push(errorMsg)
              } else {

                // 檢查網址是否有效(含https)
                if (!rules.isDomain(value) ) {
                  tableItem[key].err.push(FORM_VALIDATES_MSG.urlWrongFormat)
                  itemIllegal.push(FORM_VALIDATES_MSG.urlWrongFormat)
                } else {
                  let url = new URL(value)

                  // 為避免社群軟體間分享錯誤，網址間不允許空白
                  regex = /[ ]/g
                  if (regex.test(decodeURIComponent(url.href))){
                    errorMsg = `${rowName}不允許空白`
                    tableItem[key].err.push(errorMsg)
                    itemIllegal.push(errorMsg)
                  }
                }

                // 限制長度
                if (value.length > FORM_VALUE_MAX_LENGTH[key]) {
                  errorMsg = `${rowName}長度超過 ${FORM_VALUE_MAX_LENGTH[key]} 字`
                  tableItem[key].err.push(errorMsg)
                  itemIllegal.push(errorMsg)
                } 
              }

              break
            case 'tag':
              if (!rules.requiredString(value)) {
                errorMsg = `${rowName}必填`
                tableItem[key].err.push(errorMsg)
                itemIllegal.push(errorMsg)
              } else {
                // 去除重複tag
                let tagArray = arrayMargeDuplicateData( tableItem[key].viewValue.split('#') ).join('#')
                tableItem[key].value = tagArray
                tableItem[key].viewValue = tagArray

                // 限制長度
                if (tableItem[key].value.length > FORM_VALUE_MAX_LENGTH[key]) {
                  errorMsg = `${rowName}長度超過 ${FORM_VALUE_MAX_LENGTH[key]} 字`
                  tableItem[key].err.push(errorMsg)
                  itemIllegal.push(errorMsg)
                } 
              }
              break
            case 'expiryDate':

              const time = rules.requiredString(value) ? value : maxTime

              tableItem[key].value = time
              tableItem[key].viewValue = handleDateFormat({
                dateTime: time,
                format: 'YYYY/MM/DD 00:00:00',
              })

              if ([tableItem[key].value, tableItem[key].viewValue ].includes('Invalid Date')) {
                errorMsg = `${rowName}輸入格式錯誤`
                tableItem[key].err.push(errorMsg)
                itemIllegal.push(errorMsg)
              }

              if (isAfterDate(time, maxTime)){
                errorMsg = `${rowName}超過上限，請勿超過 ${maxTime}`
                tableItem[key].err.push(errorMsg)
                itemIllegal.push(errorMsg)
              }
              break
            case 'title': 
              if (!rules.requiredString(value)) {
                errorMsg = `${rowName}必填`
                tableItem[key].err.push(errorMsg)
                itemIllegal.push(errorMsg)
              } else {
                if (value.length > FORM_VALUE_MAX_LENGTH[key]) {
                  errorMsg = `${rowName}長度超過 ${FORM_VALUE_MAX_LENGTH[key]} 字`
                  tableItem[key].err.push(errorMsg)
                  itemIllegal.push(errorMsg)
                }
              }
              break
            case 'utmSource':
            case 'utmMedium': 
            case 'utmCampaign': 
            case 'utmTerm': 
            case 'utmContent':
              regex = /[&'"]/g

              // utm 不允許 特殊符號
              if (regex.test( decodeURIComponent(value))) {
                errorMsg = 'utm 中不允許(&), (\'), (")'
                tableItem[key].err.push(errorMsg)
                itemIllegal.push(errorMsg)
              }

              if (value.length > FORM_VALUE_MAX_LENGTH[key]) {
                errorMsg = `${rowName}長度超過 ${FORM_VALUE_MAX_LENGTH[key]} 字`
                tableItem[key].err.push(errorMsg)
                itemIllegal.push(errorMsg)
              }

              break
            case 'materialName':
              if (value.length > FORM_VALUE_MAX_LENGTH[key]) {
                errorMsg = `${rowName}長度超過 ${FORM_VALUE_MAX_LENGTH[key]} 字`
                tableItem[key].err.push(errorMsg)
                itemIllegal.push(errorMsg)
              }
              break
            case 'description':
              // 限制長度
              if (value.length > FORM_VALUE_MAX_LENGTH[key]) {
                errorMsg = `${rowName}長度超過 ${FORM_VALUE_MAX_LENGTH[key]} 字`
                tableItem[key].err.push(errorMsg)
                itemIllegal.push(errorMsg)
              } 
              break
            }

            tableItem[key].err = tableItem[key]?.err.join(' / ').replace(/^,/, '')
            tableItem[key].value = tableItem[key]?.value.trim()

            if (tableItem[key].err.length > 0) rowHeightLine.push(csvData.length)
          })

          csvData.push(tableItem)
          
        }
        
        if (csvData.length === 0) {
          setIsErrorDlgOpen(true)
        } 

        setTableRowHeightLine(rowHeightLine)
        setTableItemIllegal(arrayMargeDuplicateData(itemIllegal))
        setData(csvData)
        setTableKey(labelKeyArray)
        setValue('batchPairInfos', csvData)
      },
      error: () => {
        setIsErrorDlgOpen(true)
      },
    })
    // dispatch({ type: 'loading/closeLoading' })
  }, [])

  useEffect(() => {
    if (tableLabelIllegal.length > 0 || tableItemIllegal.length > 0){
      setIsErrorDlgOpen(true)
    }
  }, [
    tableLabelIllegal,
    tableItemIllegal,
    tableLabel,
    tableKey,
    tableRowHeightLine,
    tableExceedLimit,
  ])
  
  if (data) {
    return (
      <>
        <div className={classReader({ ShortenerStyle: 'create-form' })}>
          <div className={classReader({ ShortenerStyle: 'csv-upload-table__wrapper' }, 'scrollbar-auto')}>
            <div className={classReader({ ShortenerStyle: 'csv-upload-table' })}>
              {tableLabel.map((item, index) => <div key={index} className={classReader({ ShortenerStyle: 'csv-upload-table__header' })}>
                <div>{item.name}</div>
                <div>{item.remark}</div>
              </div>)}

              {data.map((item, index) => {
                return (tableKey.map((key, keyIndex) => <div key={keyIndex} className={classReader(tableRowHeightLine.includes(index) && 'bg-gray')}>
                  <div className={classReader({ ShortenerStyle: 'csv-upload-table__value' }, 'ellipsis mb-1')} name={key} title={item[key].viewValue}>
                    {key === 'tag' ? <>
                      {item[key].viewValue.split('#').map((tag, tagIndex) => <small key={tagIndex} className={classReader('text-tag')}>{tag}</small>)}
                    </> : <>
                      {item[key].viewValue}
                    </>}
                  </div>
                  <div className={classReader('text-sm red')}>{item[key].err}</div>
                </div>))})}
            </div>
          </div>

          <div className={classReader('py-3', { ShortenerStyle: 'btn-row' })}>
            <Button color="text-secondary" onClick={() => handlePrev()} label="上一步" outline/>
            <Button
              color={tableLabelIllegal.length > 0 || tableItemIllegal.length > 0 || tableExceedLimit || data.length === 0 ? 'gray-5' : 'green'}
              onClick={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
              label="儲存" 
              disabled={tableLabelIllegal.length > 0 || tableItemIllegal.length > 0 || tableExceedLimit || data.length === 0 }
            />
              
          </div>

        </div>

        <Modal
          prompt={isErrorDlgOpen}
          title="解析失敗"
          okBtn={tableLabelIllegal.length > 0 || data.length === 0 ? '確認返回' : '檢查匯入資料'}
          onOk={() => tableLabelIllegal.length > 0 || data.length === 0 ? handlePrev() : handleErrorDlgClose()}
        >
          <div className={classReader( tableLabelIllegal.length > 0 && 'text-center', tableLabelIllegal.length === 0 && 'text-left')}>
            <div>解析失敗，請重新確認匯入檔案是否正確</div>
    
            {tableLabelIllegal.length > 0 ? <p>
              <span className={classReader('error')}>缺少必要欄位名稱:</span>{tableLabelIllegal.join(', ')}
            </p> : <>
              {tableExceedLimit && <p className={classReader('error')}>匯入資料超過上限 100 筆</p>}
              {data.length === 0 && <p className={classReader('error')}>無量產資料或資料解析錯誤</p>}
              
              {tableItemIllegal.length > 0 && <>
                <p className={classReader('error')}>欄位資料錯誤:</p>
                <ol className={classReader('text-md')}>
                  {tableItemIllegal.map((item, index) => <li key={index} className={classReader('pb-2')}>{item}</li>)}
                </ol>
              </>}
            </>}

          </div>
        </Modal>
      </>
    )
  } else {
    return <ReactLoading
      className={classReader('m-auto loading-color')}
      type="spin"
      height={DEFAULT_SIZES.md * 2.5}
      width={DEFAULT_SIZES.md * 2.5}
    />
  }
}

export default FormTwo