import React, {
  useEffect, useState, useRef, 
} from 'react'
import Layout from 'common/layout/Layout'
import DetailCard from 'page-components/detail/detail-card'
import classReader from 'utils/classReader'
import Breadcrumbs from 'common/Breadcrumbs'
import { BREADCRUMBS_OPTION } from 'config/breadcrumbs'
import BrandAnalysisCard from 'src/page-components/analysis/result/brandAnalysisCard'
import { useRouter } from 'next/router'
import shortenerAPI from 'apis/shortener'
import analysisAPI from 'apis/analysis'
import { useError } from 'context/ErrorContext'

import {
  dateTimeApiFormat,
  dateFormat,
} from 'utils/date'

const pageName = '受眾數據 - 看A也看B'

const Related = () => {
  const router = useRouter()
  const [detailCardData, setDetailCardData] = useState({})
  const [brandCard, setbrandCard] = useState([])
  const [brandAnalysisCardLoading, setBrandAnalysisCardLoading] = useState(true)
  const { reportError } = useError()

  const getDateChart = async () => {
    try {
      
      const endDate = dateTimeApiFormat(dateFormat('now'), 'end')
      const startDate = dateTimeApiFormat(dateFormat(endDate, -31))
      const params = {
        'page': 1,
        'pageSize': 30,
        'code': detailCardData.code,
        'startDate': startDate,
        'endDate': endDate,
      }

      const result = await analysisAPI.getSiteHopperFootprints(params)
      const { success, data } = result
      if (!success) return reportError({ errorNo: result.errorNo || 9999 })
 
      let brandData = {
        same: [],
        different: [],
      }
        
      data?.pagedList.map((item, index) => {

        const card = {
          img: item.meta_image,
          tag: [],
          title: item.title,
          sort: item?.sort,
          click: item.clicks,
          desc: decodeURIComponent(`${item.clicked_domain}/${item.clicked_ourl}`),
          uu: item.uu,
        }

        if (item.isSameDomain){
          if (brandData.same.length < 5) brandData.same.push(card)
        } else {
          if (brandData.different.length < 5) brandData.different.push(card)
        }
      })
      
      // 排序 'same' 数组
      brandData.same.sort((a, b) => b.rank - a.rank)
  
      // 排序 'different' 数组
      brandData.different.sort((a, b) => b.rank - a.rank)
      setbrandCard(brandData)
 
    } catch (err){
      reportError(err)
    } finally {
      setBrandAnalysisCardLoading(false)
    }
  }

  const handlePageData = async () => {
    try {
      const { id, uu } = router.query

      const result = await shortenerAPI.simpleGet({ id: id })
      const { success, data } = result
      if (!success) return reportError({ errorNo: result.errorNo || 9999 })

      setDetailCardData({
        code: data.code,
        shortenerUrl: decodeURIComponent(`${data.brandDomain}/${data.code}`),
        destUrl: decodeURIComponent(data.destUrl),
        title: data.title,
        createDate: dateFormat(data.createDate),
        expiryDate: dateFormat(data.expiryDate),
        tags: data.tags,
        totalLabel: '不重複使用者',
        totalClick: parseInt(uu),
        totalClickHidden: false,
        createUserName: data.createUserName,
        createUserMail: data.createUserMail,
      })
 
    } catch (err){
      reportError(err)
    }
  }

  useEffect(() => {
    if (!router.isReady) return
    handlePageData()
  }, [router.isReady])

  useEffect(() => {
    if (detailCardData?.createDate && detailCardData?.expiryDate) getDateChart()
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
        <BrandAnalysisCard 
          id="brand-same"
          title="同品牌網域 Top5"
          remark="(近30天)"
          options={brandCard.same}
          loading={brandAnalysisCardLoading}
        />
      </div>

      <div className={classReader('mb-4 mt-4')}>
        <BrandAnalysisCard 
          id="brand-same"
          title="其他品牌網域 Top5"
          remark=""
          options={brandCard.different}
          loading={brandAnalysisCardLoading}
        />
      </div>
    </>
  )
}

export default Related
Related.layout = (page) => <Layout>{page}</Layout>