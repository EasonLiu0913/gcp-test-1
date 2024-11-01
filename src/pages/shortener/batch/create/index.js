import Layout from 'common/layout/Layout'
import classReader from 'utils/classReader'
import React, { useEffect } from 'react'
import Head from 'next/head'
import Breadcrumbs from 'common/Breadcrumbs'
import { BREADCRUMBS_OPTION } from 'config/breadcrumbs'
import { TAB_TITLE_SUFFIX } from 'config/head'
import CardSection from 'common/card/CardSection'
import Stepper from 'page-components/shortener/batch/stepper'
import FormOne from 'page-components/shortener/batch/form-one'
import FormTwo from 'page-components/shortener/batch/form-two'
import { useForm } from 'react-hook-form'
import { selectStep, reset as resetStep } from 'slices/stepperSlice'
import { useSelector, useDispatch } from 'react-redux'
import { USE_FORM_CONFIG } from 'config/config'

const pageName = '新增量產短網址'

const Create = () => {
  const headTitle = `${pageName}${TAB_TITLE_SUFFIX}`
  const useFormParams = useForm({ ...USE_FORM_CONFIG })
  const dispatch = useDispatch()
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
        <div className={classReader(
          { ShortenerStyle: 'create__content' },
          { ShortenerStyle: { 'create__content-with-table': stepNum === 1 } },
          { 'public-padding': stepNum === 1 },
        )}>

          <div className={classReader('pb-4')}>
            <Stepper/>
          </div>

          <div className={classReader('py-4')}>
            {
              stepNum === 0 ?
                <FormOne {...useFormParams}/> :
                stepNum === 1 ?
                  <FormTwo {...useFormParams}/> : null 
            }
          </div>
        </div>
      </CardSection>
    </div>
  </>
}

export default Create
Create.layout = (page) => <Layout>{page}</Layout>