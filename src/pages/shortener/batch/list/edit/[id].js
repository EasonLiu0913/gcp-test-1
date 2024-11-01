import Layout from 'common/layout/Layout'
import classReader from 'utils/classReader'
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Breadcrumbs from 'common/Breadcrumbs'
import { BREADCRUMBS_OPTION } from 'config/breadcrumbs'
import { TAB_TITLE_SUFFIX } from 'config/head'
import CardSection from 'common/card/CardSection'
import Stepper from 'src/page-components/shortener/batch/list/stepper'
import FormOne from 'src/page-components/shortener/batch/list/form-one'
import FormUTM from 'page-components/shortener/form-utm'
import FormThree from 'src/page-components/shortener/batch/list/form-three'
import { useForm } from 'react-hook-form'
import { selectStep, reset as resetStep } from 'slices/stepperSlice'
import { useSelector, useDispatch } from 'react-redux'
import { USE_FORM_CONFIG } from 'config/config'
import shortenerAPI from 'apis/shortener'
import { useRouter } from 'next/router'
import { URCHIN_UTM } from 'config/getParameters'
import { useError } from 'context/ErrorContext'
import {
  dateTimeFormat,
  dateFormat,
  isAfterDate,
} from 'utils/date'
import { rules } from 'utils/validation'

const pageName = '編輯量產短網址'

const Edit = () => {
  const headTitle = `${pageName}${TAB_TITLE_SUFFIX}`
  const useFormParams = useForm({ ...USE_FORM_CONFIG })
  const router = useRouter()
  const dispatch = useDispatch()
  const stepNum = useSelector(selectStep)
  const { reportError } = useError()
  const [code, setCode] = useState('')

  const handlePageData = async () => {
    dispatch({ type: 'loading/openLoading' })
    try {
      const result = await shortenerAPI.simpleGet({ id: router.query.id })
      const { data, success } = result
      if (!success) return reportError({ errorNo: result.errorNo || 9999 })

      // 優先判斷資料是否過期
      if (isAfterDate(dateTimeFormat('now'), dateTimeFormat(data.expiryDate, 'end'))){
        reportError({
          errorNo: 3,
          message: '資料已過期', 
          routerPush: `/shortener/batch/list${router.query.id}`,
        })
          
        return
      }

      useFormParams.reset({
        id: data.id,
        destUrl: decodeURIComponent(data.destUrl),
        title: data.title,
        tags: data.tags,
        code: data.code,
        expiryDate: dateFormat(data.expiryDate),
        isEnabled: data.isEnabled,
        isGetParams: data.isGetParams,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
        utmTerm: data.utmTerm,
        utmContent: data.utmContent,
        metaSiteName: data.metaSiteName,
        metaTitle: data.metaTitle,
        metaDesc: data.metaDesc,
        metaImage: data.metaImage,
      })

      setCode(rules.regularString(data.code) ? ` - ${data.code}` : '')
    } catch (err) {
      reportError(err)
      router.replace(`/shortener/batch/list${router.query.id}`)
    } finally {
      dispatch({ type: 'loading/closeLoading' })
    }
  }
 

  useEffect(() => {
    dispatch(resetStep())
  }, [])

  useEffect(() => {
    if (router.isReady) handlePageData()
  }, [router.isReady])

  return <>
    <Head>
      <title>{headTitle}</title>
    </Head>

    <div className={classReader('mb-4')}>
      <Breadcrumbs
        title={`${pageName}${code}`}
        options={BREADCRUMBS_OPTION}
      />
    </div>

    <div>
      <CardSection className={classReader('d-flex flex-center')}>
        <div className={classReader({ ShortenerStyle: 'create__content' })}>
          <div className={classReader('pb-4')}>
            <Stepper/>
          </div>
          {
            <div className={classReader('py-4')}>
              {
                stepNum === 0 ?
                  <FormOne {...useFormParams} isEditMode/> :
                  stepNum === 1 ?
                    <FormUTM {...useFormParams} isEditMode/> :
                    stepNum === 2 ?
                      <FormThree {...useFormParams} isEditMode/> : null
              }
            </div>
          }
        </div>
      </CardSection>
    </div>
  </>
}
export default Edit
Edit.layout = (page) => <Layout>{page}</Layout>

