import Layout from 'common/layout/Layout'
import classReader from 'utils/classReader'
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Breadcrumbs from 'common/Breadcrumbs'
import { BREADCRUMBS_OPTION } from 'config/breadcrumbs'
import { TAB_TITLE_SUFFIX } from 'config/head'
import CardSection from 'common/card/CardSection'
import Stepper from 'page-components/shortener/one-on-one/stepper'
import FormOne from 'page-components/shortener/parameters/form-one'
import FormUTM from 'page-components/shortener/form-utm'
import FormThree from 'page-components/shortener/parameters/form-three'
import { useForm } from 'react-hook-form'
import { selectStep, reset as resetStep } from 'slices/stepperSlice'
import { useSelector, useDispatch } from 'react-redux'
import { USE_FORM_CONFIG } from 'config/config'
import { useRouter } from 'next/router'
import { useError } from 'context/ErrorContext'
import shortenerIndividualAPI from 'apis/shortenerIndividual'

import {
  dateTimeFormat,
  dateFormat,
  isAfterDate,
} from 'utils/date'

const pageName = '編輯1:1自定義參數短網址'
const createType = 'Parameter'

const Edit = () => {
  const headTitle = `${pageName}${TAB_TITLE_SUFFIX}`
  const useFormParams = useForm({
    defaultValues: {
      campaignStartDate: dateFormat('now'),
      expiryDate: dateFormat('now', 365),
      isEnabled: true,
      isGetParams: false,
    },
    ...USE_FORM_CONFIG,
  })
  const dispatch = useDispatch()
  const router = useRouter()
  const stepNum = useSelector(selectStep)
  const { reportError } = useError()
  
  const handleGetInfo = async () => {
    dispatch({ type: 'loading/openLoading' })
    try {
      const result = await shortenerIndividualAPI.getInfo({ id: router.query.id })
      const { data, success } = result
      if (!success) return reportError({ errorNo: result.errorNo || 9999 })

      // 優先判斷資料是否過期
      if (isAfterDate(dateTimeFormat('now'), dateTimeFormat(data.expiryDate, 'end'))){
        reportError({
          errorNo: 3,
          message: '資料已過期', 
          routerPush: '/shortener/one-on-one',
        })
          
        return
      }
      
      useFormParams.reset({
        campaignStartDate: data.campaignStartDate,
        id: data.id,
        pairInfoId: data.pairInfo.id,
        destUrl: decodeURIComponent(data.pairInfo.destUrl),
        title: data.pairInfo.title,
        tags: data.pairInfo.tags,
        code: data.pairInfo.code,
        expiryDate: dateFormat(data.pairInfo.expiryDate),
        isEnabled: data.pairInfo.isEnabled,
        isGetParams: data.pairInfo.isGetParams,
        utmSource: data.pairInfo.utmSource,
        utmMedium: data.pairInfo.utmMedium,
        utmCampaign: data.pairInfo.utmCampaign,
        utmTerm: data.pairInfo.utmTerm,
        utmContent: data.pairInfo.utmContent,
        metaSiteName: data.pairInfo.metaSiteName,
        metaTitle: data.pairInfo.metaTitle,
        metaDesc: data.pairInfo.metaDesc,
        metaImage: data.pairInfo.metaImage,
        parameters: data.parameters,
      })
      
    } catch (err) {
      reportError(err)
      router.replace('/shortener/one-on-one')
    } finally {
      dispatch({ type: 'loading/closeLoading' })
    }
  }

  useEffect(() => {
    dispatch(resetStep())
  }, [])

  useEffect(() => {
    if (router.isReady) handleGetInfo()
  }, [router.isReady])

  return <>
    <Head>
      <title>{headTitle}</title>
    </Head>

    <div className={classReader('mb-4')}>
      <Breadcrumbs
        title={pageName}
        options={BREADCRUMBS_OPTION}
      />
    </div>

    <div>
      <CardSection className={classReader('d-flex flex-center')}>
        <div className={classReader({ ShortenerStyle: 'create__content' })}>
          <div className={classReader('pb-4')}>
            <Stepper/>
          </div>

          <div className={classReader('py-4')}>
            {
              stepNum === 0 ?
                <FormOne {...useFormParams}/> :
                stepNum === 1 ?
                  <FormUTM {...useFormParams} /> :
                  stepNum === 2 ?
                    <FormThree {...useFormParams} /> : null
            }
          </div>
        </div>
      </CardSection>
    </div>
  </>
}

export default Edit
Edit.layout = (page) => <Layout>{page}</Layout>

