import Layout from 'common/layout/Layout'
import classReader from 'utils/classReader'
import React from 'react'
import Head from 'next/head'
import Breadcrumbs from 'common/Breadcrumbs'
import { BREADCRUMBS_OPTION } from 'config/breadcrumbs'
import { TAB_TITLE_SUFFIX } from 'config/head'
import CardSection from 'common/card/CardSection'
import FormFinish from 'page-components/shortener/parameters/form-finish'

const pageName = '編輯1:1個人化短網址'

const Finish = () => {
  const headTitle = `${pageName}${TAB_TITLE_SUFFIX}`
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
          <div className={classReader('py-4')}>
            <FormFinish />
          </div>
        </div>
      </CardSection>
    </div>
  </>
}

export default Finish
Finish.layout = (page) => <Layout>{page}</Layout>