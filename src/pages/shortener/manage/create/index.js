import Layout from 'common/layout/Layout'
import classReader from 'utils/classReader'
import React, { useEffect } from 'react'
import Head from 'next/head'
import Breadcrumbs from 'common/Breadcrumbs'
import { BREADCRUMBS_OPTION } from 'config/breadcrumbs'
import { TAB_TITLE_SUFFIX } from 'config/head'
import CardSection from 'common/card/CardSection'
import Stepper from 'page-components/shortener/manage/stepper'
import FormOne from 'page-components/shortener/manage/form-one'
import FormUTM from 'page-components/shortener/form-utm'
import FormThree from 'page-components/shortener/manage/form-three'
import { useForm } from 'react-hook-form'
import { dateFormat } from 'utils/date'
import { selectStep, reset as resetStep } from 'slices/stepperSlice'
import { useSelector, useDispatch } from 'react-redux'
import { USE_FORM_CONFIG } from 'config/config'

const pageName = '新增單一短網址'

const Create = () => {
  const headTitle = `${pageName}${TAB_TITLE_SUFFIX}`
  const dispatch = useDispatch()
  const useFormParams = useForm({
    ...USE_FORM_CONFIG,
    defaultValues: {
      expiryDate: dateFormat('now', 365),
      isEnabled: true,
      isGetParams: false,
    },
  })
  const stepNum = useSelector(selectStep)

  useEffect(() => {
    return () => dispatch(resetStep())
  }, [])

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
            <Stepper />
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

export default Create
Create.layout = (page) => <Layout>{page}</Layout>