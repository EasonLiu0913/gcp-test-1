import React, {
  useEffect, useState, useRef, 
} from 'react'
import { useForm } from 'react-hook-form'
import { USE_FORM_CONFIG } from 'config/config'
import { useRouter } from 'next/router'
import { useError } from 'context/ErrorContext'
import { BREADCRUMBS_OPTION } from 'config/breadcrumbs'
import { DEFAULT_SIZES } from 'config/style'
import classReader from 'utils/classReader'
import {
  dateFormat, isBeforeDate, isAfterDate,
} from 'utils/date'
import { hookFormValidates } from 'utils/hookFormValidates'
import shortenerAPI from 'apis/shortener'
import analysisAPI from 'apis/analysis'
import Layout from 'common/layout/Layout'
import Breadcrumbs from 'common/Breadcrumbs'
import CardSection from 'common/card/CardSection'
import DetailCard from 'page-components/detail/detail-card'
import LabelChartBar from 'page-components/analysis/audience/label-chart-bar'
import ReactLoading from 'react-loading'
import SearchBar from 'common/SearchBar'
import DatePicker from 'common/form/DatePicker'
import dayjs from 'dayjs'
import Modal from 'common/Modal'
import { rules } from 'utils/validation'

const pageName = '受眾標籤'

const Label = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [detailCardData, setDetailCardData] = useState({})
  const [dateChart, setDateChart] = useState([])
  const { reportError } = useError()
  const [packedBubbleOptions, setPackedBubbleOptions] = useState([])
  const [labelSearchError, setLabelSearchError] = useState([])
  const [notQueryScope, setNotQueryScope] = useState(false)

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
    // 避免 code 未取得前執行查詢
    if (!rules.required(detailCardData.code)) return
    let errorMag = []

    // 查詢大於90天
    if (Math.abs(dayjs(data.startDate).diff(data.endDate, 'day')) > 90){
      errorMag.push('查詢時間區間超過90日')
    }

    if (isBeforeDate(data.startDate, detailCardData.createDate) || isBeforeDate(data.endDate, detailCardData.createDate)) {
      errorMag.push('查詢起訖日小於建立日期')
    }

    if (isAfterDate(data.endDate, detailCardData.expiryDate) || isAfterDate(data.endDate, detailCardData.expiryDate)) {
      errorMag.push('查詢起訖日大於下架日期')
    }

    if (isAfterDate(data.startDate, data.endDate)) {
      errorMag.push('查詢訖日大於迄日')
    }

    if (errorMag.length === 0) {
      getDateChart(
        data.startDate,
        data.endDate,
        detailCardData.code,
      )
    } else setLabelSearchError(errorMag)
  }

  const getDateChart = async (
    startDate, endDate, code,
  ) => {
    setIsLoading(true)
    try {

      const params = {
        'page': 1,
        'pageSize': 10,
        'code': code,
        'startDate': startDate,
        'endDate': endDate,
      }
      const result = await analysisAPI.getGaChtLabel(params)

      const { success, data } = result
      if (!success) return reportError(result)
      if (data.pagedList.length === 0) return setDateChart([])

      let chartPackedBubbleData = []
      data.pagedList.map((item, index) => {
        chartPackedBubbleData.push({
          label: item.chtTag,
          value: item.uniqueUsers,
        })
      })

      setDateChart(data.pagedList)
      setPackedBubbleOptions(chartPackedBubbleData)
   
    } catch (err){
      if (err.errorNo === 3) setDateChart([])
      reportError(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageData = async () => {
    try {
      const { id, uu } = router.query
      const result = await shortenerAPI.simpleGet({ id: id })

      if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })

      const { data } = result
      const shortenerUrl = decodeURIComponent(`${data.brandDomain}/${data.code}`)

      setDetailCardData({
        code: data.code,
        shortenerUrl: decodeURIComponent(shortenerUrl),
        destUrl: decodeURIComponent(data.destUrl),
        title: data.title,
        subTitle: `短網址: <a href="${shortenerUrl}" target="_blank">${shortenerUrl}</a>`,
        createDate: dateFormat(data.createDate),
        expiryDate: dateFormat(data.expiryDate),
        tags: data.tags,
        totalLabel: '不重複使用者',
        totalClick: parseInt(uu),
        totalClickHidden: false,
        createUserName: data.createUserName,
        createUserMail: data.createUserMail,
      })

      if (isBeforeDate(dateFormat('now', -6), dateFormat(data.createDate))) setNotQueryScope(true)

      // default
      let startDate = isBeforeDate(dateFormat('now', -13), dateFormat(data.createDate)) ? dateFormat(data.createDate) : dateFormat('now', -13)
      let endDate = isBeforeDate(dateFormat('now', -6), dateFormat(data.expiryDate)) ? dateFormat('now', -6) : dateFormat(data.expiryDate)
      endDate = isAfterDate(dateFormat(endDate), dateFormat(data.createDate)) ? dateFormat(endDate) : dateFormat(data.createDate)

      // 設定預設時間
      setValue('startDate', startDate)
      setValue('endDate', endDate)

      // 查詢圖表
      getDateChart(
        startDate,
        endDate,
        data.code,
      )

    } catch (err){
      reportError(err)
      return router.replace('/analysis/audience')
    }
  }

  useEffect(() => {
    if (!router.isReady) return
    handlePageData()
  }, [router.isReady])

  useEffect(() => {
  }, [detailCardData])

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
        {!notQueryScope && <SearchBar
          setFilter={onSubmit}
          handleSubmit={handleSubmit}
          reset={reset}
          setValue={setValue}
          getValues={getValues}
        >
          
          <div className={classReader('col-12')}>
            <div className={classReader('px-2 gray-6 text-sm')}>
              <p>為加速提供查詢結果，單次的時間區間僅提供查詢起訖90日內的資料。</p>
            </div>
          </div>
          
          <div className={classReader('col-12 col-sm-6')}>
            <div className={classReader('px-2')}>
              <div className={classReader('text-title')}>日期區間（起）</div>
              <DatePicker
                className={classReader('mb-4')}
                name="startDate"
                control={control}
                controllerError={errors?.startDate?.message}
                validate={hookFormValidates().startDate}
              // minDate={detailCardData.minDate}
              // maxDate={detailCardData.maxDate}
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
              // minDate={detailCardData.minDate}
              // maxDate={detailCardData.maxDate}
              />
            </div>
          </div>
        </SearchBar>}
      </div>

      {isLoading ? <>
        <CardSection className={classReader({ AnalysisStyle: 'label-chart' }, 'd-flex align-items-center justify-content-center')}>
          <ReactLoading
            className={classReader('my-5 m-auto loading-color')}
            type="spin"
            height={DEFAULT_SIZES.md * 2.5}
            width={DEFAULT_SIZES.md * 2.5}
          />
        </CardSection>
      </> : <>
        {dateChart.length > 0 ? <>

          <div className={classReader('mb-4')}>
            <LabelChartBar 
              title={detailCardData.title} 
              subTitle={detailCardData.subTitle}
              unitLable="uniqueUsers" 
              optionLabel="uniqueUsers"
              options={packedBubbleOptions} 
              barValue
            />
          </div>
          <Modal
            prompt={Boolean(labelSearchError.length)}
            title="系統提示"
            onClose={() => setLabelSearchError([])}
            okBtn= "確定"
            onOk={() => setLabelSearchError([])}
            close
          >
            <div className={classReader('red text-center')}>
              {labelSearchError.map((item, index) => <p key={index} className={classReader('mt-0 mb-2')}>{item}</p>)}
            </div>
          </Modal>
        </> : <>
          <CardSection className={classReader({ AnalysisStyle: 'label-chart' }, 'd-flex align-items-center justify-content-center text-xl gray-6')}>
            暫無資料
          </CardSection>
        </>}

      </>}
      
    </>
  )
}

export default Label
Label.layout = (page) => <Layout>{page}</Layout>