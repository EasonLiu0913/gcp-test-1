
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import classReader from 'utils/classReader'
import { handleHeadParams, useCheckPermission } from 'utils/util'
import { TAB_TITLE_SUFFIX } from 'config/head'
import { BREADCRUMBS_OPTION } from 'config/breadcrumbs'
import Breadcrumbs from 'common/Breadcrumbs'
import Layout from 'common/layout/Layout'
import CardSection from 'common/card/CardSection'
import PackageCard from 'page-components/permission/plan/planCard'
import AddPackageCard from 'page-components/permission/plan/addPlanCard'
import planAPI from 'apis/plan'
import { useError } from 'context/ErrorContext'

// 預留 SSR 區塊
export async function getServerSideProps(context) {
  const headParams = handleHeadParams(context)
  return { props: { ...headParams } }
}

const pageCode = '202'
const pageName = '商品方案管理'
const headTitle = `${pageName}${TAB_TITLE_SUFFIX}`

const Plan = (props) => {
  const [data, setData] = useState([])
  const { reportError } = useError()
  const [R, W] = useCheckPermission(pageCode)

  const handlePlanGet = async () => {
    try {
      const result = await planAPI.get({ pageSize: 100 })
      const { data, success } = result
      if (!success) return reportError({ errorNo: result.errorNo || 9999 })
      setData(data.pagedList)
    } catch (err) {
      reportError(err)
    }
  }

  useEffect(() => {
    handlePlanGet()
  }, [])

  return (
    <>
      <Head>
        <title>{headTitle}</title>
      </Head>

      <div className={classReader('mb-4')}>
        <Breadcrumbs
          title={pageName}
          options={BREADCRUMBS_OPTION}
        />
      </div>
      
      <div className={classReader('my-4')}>
        <div className={classReader({ PermissionStyle: 'plan-wrapper' })}>
          { W && <AddPackageCard />}
          {data.map( (item, index) => <PackageCard key={index} {...item} />)}
        </div>
      </div>
   
    </>
  )
}
export default Plan
Plan.layout = (page) => <Layout>{page}</Layout>