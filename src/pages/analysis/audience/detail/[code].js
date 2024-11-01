import React, {
  useEffect, useState, useRef, 
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
import { useError } from 'context/ErrorContext'
import { useDispatch } from 'react-redux'
import { dateFormat } from 'utils/date'
import DatePicker from 'common/form/DatePicker'
import SearchBar from 'common/SearchBar'
import { useForm } from 'react-hook-form'
import { USE_FORM_CONFIG } from 'config/config'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { hookFormValidates } from 'utils/hookFormValidates'
dayjs.extend(isSameOrBefore)

const pageName = '成效數據'

const Related = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [detailCardData, setDetailCardData] = useState({})
  const [dateChart, setDateChart] = useState([])
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

  const onSubmit = async (data) => {
    try {
      if (!codeRef.current) return //預設會打一次搜尋先取消，需要有code 才有辦法搜到資料
      let params = {
        code: codeRef.current,
        createDateSortBy: 'DESC',
        qty: 10,
        ...data, 
      }

      const result = await analysisAPI.trackingByDate(params)
      if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })

      const { startDate, endDate } = data
      const dataArray = []
      let datePointer = startDate
      let resultIndexPointer = 0

      while (dayjs(datePointer).isSameOrBefore(endDate)) {
        if (datePointer === result.data?.[resultIndexPointer]?.dataDate) {
          dataArray.push({
            time: datePointer,
            count: result.data[resultIndexPointer].clickQty,
          })
          resultIndexPointer++
        } else {
          dataArray.push({
            time: datePointer,
            count: 0,
          })
        }
        datePointer = dateFormat(datePointer, 1)
      }
      setDateChart(dataArray)
    } catch (err){
      reportError(err)
    }
  }

  const handlePageData = async () => {
    dispatch({ type: 'loading/openLoading' })
    try {
      const { id } = router.query
      const result = await shortenerAPI.simpleGet({ id: id })
      if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })
      
      const { data } = result
      setDetailCardData({
        code: data.code,
        shortenerUrl: `${data.brandDomain}/${data.code}`,
        destUrl: data.destUrl,
        title: data.title,
        createDate: dateFormat(data.createDate),
        expiryDate: dateFormat(data.expiryDate),
        tags: data.tags,
        totalClick: data.totalClick,
        createUserName: data.createUserName,
        createUserMail: data.createUserMail,
      })
      codeRef.current = data.code
      onSubmit(getValues())

    } catch (err){
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
              />
            </div>
          </div>
        </SearchBar>
      </div>

      <div className={classReader('mb-4')}>
        <CountAreaChart data={dateChart}/>
      </div>
    </>
  )
}

export default Related
Related.layout = (page) => <Layout>{page}</Layout>