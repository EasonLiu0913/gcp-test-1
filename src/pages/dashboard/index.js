import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { handleHeadParams } from 'utils/util'
import { TAB_TITLE_SUFFIX } from 'config/head'
import Layout from 'common/layout/Layout'
import Summary from 'page-components/dashboard/summary'
import Search from 'page-components/dashboard/search'
import DailyHighlight from 'page-components/dashboard/dailyHighlight'
import WeeklyCreatedRanking from 'page-components/dashboard/weeklyCreatedRanking'
import WeeklyClickedRanking from 'page-components/dashboard/weeklyClickedRanking'
import DailyClickedTopFive from 'page-components/dashboard/dailyTopFiveClicked'
import classReader from 'utils/classReader'
import { selectUser } from 'slices/userSlice'
import { useSelector } from 'react-redux'
import { localStorage } from 'utils/storage'
import { useRouter } from 'next/router'
import { useError } from 'context/ErrorContext'
import Modal from 'common/Modal'
import { isBeforeDate } from 'utils/date'

export async function getServerSideProps(context) {
  const myEnv = process.env.NEXT_PUBLIC_MY_TEST_STRING_3 || 'hi';
  const headParams = handleHeadParams(context)
  return { props: { ...headParams,myEnv } }
}

const Dashboard = (props) => {
  const {myEnv} = props
  const pageName = 'Dashboard'
  const headTitle = `${pageName}${TAB_TITLE_SUFFIX}`
  const user = useSelector(selectUser)
  const brandDomain = user.defaultProjectBrandDomain
  const router = useRouter()
  const [remindStatus, setRemindNum] = useState(false)
  const [totalClick, setTotalClick] = useState(0)

  useEffect(() => {
    if (isBeforeDate('now', '2024-08-30')) {
      let remindNum = localStorage.get('remindNum')
      const prevBrandDomain = localStorage.get('prevBrandDomain')
      remindNum = (remindNum === null ? 0 : parseInt(remindNum)) + 1
      if (brandDomain === 'ourl.tw' && prevBrandDomain !== 'ourl.tw') {
        if (remindNum <= 3) {
          setRemindNum(true)
          localStorage.set('remindNum', remindNum)
        }
      }
  
      localStorage.set('prevBrandDomain', brandDomain)
    }
  }, [router.isReady])

  return <>
    <Head>
      <title>{headTitle}</title>
    </Head>
    <div>
      <p>0.0.1</p>
      <p>{process.env.NEXT_PUBLIC_MY_TEST_STRING || 'no env 1'}</p>
      <p>{process.env.NEXT_PUBLIC_MY_TEST_STRING_2 || 'no env 2'}</p>
      <p>{myEnv ||  'no env 3'}</p>
      <div className={classReader('mb-3')}>
        <Summary totalClick={totalClick} />
      </div>
      <div className={classReader('mb-3')}>
        <Search brandDomain={brandDomain} />
      </div>
      <div className={classReader('mb-3', { DashboardStyle: 'daily-section' })}>
        <DailyHighlight brandDomain={brandDomain} />
        <DailyClickedTopFive />
      </div>
      <div className={classReader('mb-3')}>
        <WeeklyCreatedRanking />
      </div>
      <div className={classReader('mb-3')}>
        <WeeklyClickedRanking setTotalClick={setTotalClick} />
      </div>
    </div>

    <Modal
      prompt={remindStatus}
      className={classReader('m-2')}
      title="溫馨提醒"
      onClose={() => setRemindNum(false)}
      separator
      // persistent
      okBtn="確認"
      onOk={() => setRemindNum(false)}
      close
    >
      <h3>歡迎ourl.tw的使用者加入OmniU😊！</h3>
      <div className={classReader('text-left')}>
        <p>1. ourl.tw網域的所有短網址在7/16起採提供即時點擊數據，若有需要7/15前數據的夥伴們，請來信 <a href="mailto:SHARONSU@hotaiconnected.com.tw" className={classReader('primary')}>SHARONSU@hotaiconnected.com.tw</a> </p>
        <p>2. 權限：目前是查看自己建立的短網址與成效</p>
      </div>
    </Modal>
  </>
}

export default Dashboard
Dashboard.layout = (page) => <Layout>{page}</Layout>
