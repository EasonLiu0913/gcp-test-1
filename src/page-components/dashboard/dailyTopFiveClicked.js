import React, { useEffect, useState } from 'react'
import { handleHeadParams } from 'utils/util'
import { thousandthsFormat } from 'utils/valueFormat'
import classReader from 'utils/classReader'
import dashboardAPI from 'apis/dashboard'
import ReactLoading from 'react-loading'
import { DEFAULT_SIZES } from 'config/style'
import { useError } from 'context/ErrorContext'
import { useSnackbar } from 'notistack'

export async function getServerSideProps(context) {
  const headParams = handleHeadParams(context)
  return { props: { ...headParams } }
}

const DailyClickedTopFive = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { reportError } = useError()
  const { enqueueSnackbar } = useSnackbar()

  const getlast24HoursTracking = async () => {
    try {
      const result = await dashboardAPI.getlast24HoursTracking()
      const { data, success } = result
      if (!success) return reportError({ errorNo: result.errorNo && 9999 })

      // 只顯示前5筆
      setData(data.length > 5 ? data.slice(0, 5) : data)
          
    } catch (err) {
      if (parseInt(err.errorNo) === 3){
        enqueueSnackbar('「近24小時的點擊前5名」目前無資料', { className: classReader('success bg-success-light') })
      } else reportError(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getlast24HoursTracking()
  }, [])

  return <section className={classReader('p-4 p-lg-5 pb-0 rounded border d-flex flex-column', { DashboardStyle: 'daily-top-five-clicked' })}>
    <div className={classReader('')}>
      <div className={classReader('h5 bold')}>近24小時的點擊前5名</div>
      <div className={classReader('text-secondary mt-1 mb-3')}>24 Hours Clicked Top 5</div>
    </div>

    {data.length ? <>
      <div className={classReader('mt-2 pb-3')}>
        {
          data.map((item) => <div className={classReader('row', { DashboardStyle: 'row' })} key={item.pairInfoId}>
            <div className={classReader('col-8')}>
              <div className={classReader('text-lg pt-0 ellipsis')}>{item.title}</div>
              <div className={classReader('pt-1 ellipsis text-secondary')}>{item.shortUrl}</div>
            </div>
            <div className={classReader('col-4 h4 d-flex align-items-center justify-content-end')}>
              {thousandthsFormat(item.clickQty)}
            </div>
          </div>)
        }
      </div>
    </> : <div className={classReader('h-full text-secondary d-flex align-items-center justify-content-center pt-4')}>
      {isLoading ?
        <ReactLoading
          className={classReader('my-5 m-auto loading-color')}
          type="spin"
          height={DEFAULT_SIZES.md * 2.5}
          width={DEFAULT_SIZES.md * 2.5}
        /> : '查無資料'}
    </div>
    }

  </section>
}
export default DailyClickedTopFive