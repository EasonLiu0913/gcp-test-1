import React, {
  useEffect, useState, useRef, memo,
} from 'react'
import Layout from 'common/layout/Layout'
import DetailCard from 'page-components/detail/detail-card'
import classReader from 'utils/classReader'
import Breadcrumbs from 'common/Breadcrumbs'
import { BREADCRUMBS_OPTION } from 'config/breadcrumbs'
import CountAreaChart from 'page-components/detail/count-area-chart'
import { useRouter } from 'next/router'
import shortenerAPI from 'apis/shortener'
import analysisAPI from 'apis/analysis'
import { useDispatch } from 'react-redux'
import {
  dateFormat,
  dateTimeApiFormat,
  isAfterDate,
} from 'utils/date'
import DatePicker from 'common/form/DatePicker'
import SearchBar from 'common/SearchBar'
import { useForm } from 'react-hook-form'
import { USE_FORM_CONFIG } from 'config/config'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { useError } from 'context/ErrorContext'
import Button from 'common/Button'
import { hookFormValidates } from 'utils/hookFormValidates'
import { DATE_FORMAT } from 'config/date'
import { rules } from 'utils/validation'

dayjs.extend(isSameOrBefore)

const pageName = '成效數據'

const Detail = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [detailCardData, setDetailCardData] = useState({})
  const [dateChart, setDateChart] = useState([])
  const [trackingByDate, setTrackingByDate] = useState({})
  const [isSearching, setIsSearching] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  let codeRef = useRef(null)
  const { reportError } = useError()

  const {
    handleSubmit, control, reset, setValue, getValues, formState: { errors },
  } = useForm({
    ...USE_FORM_CONFIG,
    defaultValues: {
      endDate: dateFormat('now', 'end'),
      startDate: dateFormat('now', -6),
    },
  })

  // 生成所有日期的函數
  const generateDateRange = (
    start, end, data,
  ) => {
    const dataResults = []

    if (rules.requiredArray(data)) {
      const lookup = new Map(data.map(item => [item.date, item.clickQty]))

      const limitDay = dayjs(end).diff(start, 'day')
      for (let i = 0; i <= limitDay; i++) {
        let time = dayjs(start).add(0 + i, 'day').format(DATE_FORMAT)
        let count = lookup.has(time) ? lookup.get(time) : 0

        dataResults.push({
          time: time,
          count: count,
        })
      }
    }

    return dataResults
  }

  const onSubmit = async (data, autoDownload = false) => {
    if (!autoDownload) setIsSearching(true)
    if (autoDownload) setIsExporting(true)
    try {
      if (!codeRef.current) return //預設會打一次搜尋先取消，需要有code 才有辦法搜到資料

      const startDate = dateTimeApiFormat(data.startDate, 0)
      const endDate = dateTimeApiFormat(data.endDate, 'end')

      let params = {
        code: codeRef.current,
        createDateSortBy: 'DESC',
        qty: 10,
        startDate,
        endDate,
      }

      if (isAfterDate(params.startDate, params.endDate)) {
        reportError({
          errorNo: 9999,
          message: '日期區間（起）超過 日期區間（訖）',
        })
        return
      }

      // 檢查日期相同、或無日期(重置)時不搜尋，減少 api 呼叫次數
      const searchStartDate = dateFormat(trackingByDate.startDate)
      const searchEndDate = dateFormat(trackingByDate.endDate)
      
      if (searchStartDate === dateFormat(data.startDate) && searchEndDate === dateFormat(data.endDate)) return
      if (!data.startDate || !data.endDate ) return 
      
      setTrackingByDate(params)

      const result = await analysisAPI.trackingByDate(params)
      if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })

      const dataChartData = generateDateRange(
        params.startDate,
        params.endDate,
        result.data,
      )

      setDateChart(dataChartData)
      if (autoDownload) downloadCSV(
        dataChartData, dateFormat(data.startDate), dateFormat(data.endDate),
      )

    } catch (err) {
      reportError(err)
    } finally {
      if (!autoDownload) setIsSearching(false)
      if (autoDownload) setIsExporting(false)
    }
  }

  const downloadCSV = (
    data, searchStartDate, searchEndDate,
  ) => {
    // 將資料轉換為 CSV 格式的字串
    let csvContent = '序號,資料日期,點擊數\n'  
    const convertData = data.forEach((item, index) => {
      return csvContent += `${index + 1},${item.time},${item.count}\n`
    })

    // 產生檔名
    const startDate = searchStartDate ?? dateFormat(trackingByDate.startDate)
    const endDate = searchEndDate ?? dateFormat(trackingByDate.endDate, -1)
    const fileName = `effect-${trackingByDate.code}_${startDate}-${endDate}.csv`

    // 產生 csv 並下載
    const dataWithPrefix = '\ufeff' + csvContent
    const blob = new Blob([dataWithPrefix], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setIsExporting(false)
  }

  const ExportButton = () => {
    const exportCSV = async () => {
      setIsExporting(true)
      try {
        const { startDate, endDate } = getValues()
        const searchStartDate = dateFormat(trackingByDate.startDate)
        const searchEndDate = dateFormat(trackingByDate.endDate)
        
        if (searchStartDate === dateFormat(startDate) && searchEndDate === dateFormat(endDate)){
          // 日期相同不呼叫 api，直接下載
          downloadCSV(
            dateChart, searchStartDate, searchEndDate,
          )
        }
        else {
          // 日期不同呼叫 api，並開啟自動下載功能
          onSubmit(getValues(), true)
        }
      } catch (err) {
        reportError(err)
        setIsExporting(false)
      } 
    }
      
    return <Button
      className={classReader('my-0 mx-2')}
      color="primary"
      label="匯出"
      onClick={exportCSV}
      isLoading={isExporting}
      disabled={isExporting}
    />
  }

  const handlePageData = async () => {
    dispatch({ type: 'loading/openLoading' })
    try {
      const { id } = router.query

      const result = await shortenerAPI.simpleGet({ id: id })
      const { data, success } = result
      if (!success) return reportError({ errorNo: result.errorNo || 9999 })
      const createDate = dateFormat(data.createDate)
      const expiryDate = dateFormat(data.expiryDate)

      setDetailCardData({
        code: data.code,
        shortenerUrl: decodeURIComponent(`${data.brandDomain}/${data.code}`),
        destUrl: decodeURIComponent(data.destUrl),
        title: data.title,
        createDate: createDate,
        expiryDate: expiryDate,
        tags: data.tags,
        totalClick: data.totalClick,
        createUserName: data.createUserName,
        createUserMail: data.createUserMail,
      })

      codeRef.current = data.code
      onSubmit(getValues())
    } catch (err) {
      reportError(err)
      return router.replace('/analysis/effect')
    } finally {
      dispatch({ type: 'loading/closeLoading' })
    }
  }

  useEffect(() => {
    if (!router.isReady) return
    handlePageData()
  }, [router.isReady])

  return (
    <>
      <div className={classReader('mb-4')}>
        <Breadcrumbs
          title={pageName}
          options={BREADCRUMBS_OPTION}
        />
      </div>

      <div className={classReader('mb-4')}>
        <DetailCard {...detailCardData} />
      </div>

      <div className={classReader('mb-4')}>
        {/*
          這裡的用法很怪，被原本封裝tableWithSearch 搞到
          handleSubmit 是react-hook-form 拿來驗validation用
          setFilter 是驗完了之後傳回來filter 的值
        */}
        <SearchBar
          setFilter={onSubmit}
          handleSubmit={handleSubmit}
          reset={reset}
          setValue={setValue}
          getValues={getValues}
          isSearching={isSearching}
        >
          <div className={classReader('col-12 col-sm-6')}>
            <div className={classReader('px-2')}>
              <div className={classReader('text-title')}>日期區間（起）</div>
              <DatePicker
                className={classReader('mb-4')}
                name="startDate"
                control={control}
                controllerError={errors?.startDate?.message}
                validate={hookFormValidates().startDate}
              // minDate={detailCardData.createDate}
              // maxDate={detailCardData.expiryDate}
              />
            </div>
          </div>

          <div className={classReader('col-12 col-sm-6')}>
            <div className={classReader('px-2')}>
              <div className={classReader('text-title')}>日期區間（訖）</div>
              <DatePicker
                className={classReader('mb-4')}
                name="endDate"
                control={control}
                controllerError={errors?.endDate?.message}
                validate={hookFormValidates().endDate}
              // minDate={detailCardData.createDate}
              // maxDate={detailCardData.expiryDate}
              />
            </div>
          </div>
        </SearchBar>
      </div>

      <div className={classReader('mb-4 pb-3')}>
        <div className={classReader('mb-4 pb-3')}>
          <CountAreaChart
            data={dateChart}
            chartHeaderClassName="text-right pl-3 pr-3 pb-3"
            chartHeaderChildren={<ExportButton />}
          />
        </div>
      </div>
    </>
  )
}

export default Detail
Detail.layout = (page) => <Layout>{page}</Layout>