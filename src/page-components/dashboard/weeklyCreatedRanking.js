import React, {
  Fragment, useEffect, useState, 
} from 'react'
import { handleHeadParams } from 'utils/util'
import { thousandthsFormat } from 'utils/valueFormat'
import classReader from 'utils/classReader'
import Button from 'common/Button'
import dashboardAPI from 'apis/dashboard'
import { dateFormat } from 'utils/date'
import ReactLoading from 'react-loading'
import { DEFAULT_SIZES } from 'config/style'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useError } from 'context/ErrorContext'
import {
  SORTED_CONFIG, 
  TYPE_MAPPING,
  TRACKING_BY_CREATE_DAYS_PARAMS_DEFAULT,
} from 'config/dashboard'
import SortedBtn from 'common/SortedBtn'
import { useSnackbar } from 'notistack'

export async function getServerSideProps(context) {
  const headParams = handleHeadParams(context)
  return { props: { ...headParams } }
}

const WeeklyCreatedRanking = () => {
  const [sortedIndex, setSortedIndex] = useState('')
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortedBtnStyleSwitch, setSortedBtnStyleSwitch] = useState('2')
  const router = useRouter()
  const { reportError } = useError()
  const { enqueueSnackbar } = useSnackbar()
  const labelText = '近7日內建立活動的點擊概況'

  const SortedBtnStyle2 = ({ label, index }) => {
    return <div 
      className={ classReader('border rounded d-flex flex-center flex-column', { DashboardStyle: 'sorted-btn' })}
      onClick={() => setSortedIndex(index)}
    >
      <i className={classReader(`icon icon-apps ${sortedIndex === index ? 'icon-primary' : 'icon-text-secondary'}`)}/>
      <div className={classReader(`${sortedIndex === index ? 'primary' : 'text-secondary'}`)}>{label}</div>
    </div>
  }

  const getTrackingByCreateDays = async () => {
    setIsLoading(true)
    try {
      setData([])
      const params = {
        ...TRACKING_BY_CREATE_DAYS_PARAMS_DEFAULT,
        startDate: dateFormat('now', -6),
        endDate: dateFormat('now', 'end'),
        createKind: sortedIndex,
      }
      const result = await dashboardAPI.trackingByCreateDays(params)
      if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })
      setData(result?.data.slice(0, TRACKING_BY_CREATE_DAYS_PARAMS_DEFAULT.LimitTotalQty) ?? [])
    } catch (err) {
      if (parseInt(err.errorNo) === 3) enqueueSnackbar(`「${labelText}」目前無資料`, { className: classReader('success bg-success-light') })
      else reportError(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getTrackingByCreateDays()
  }, [sortedIndex])

  useEffect(() => {
    const { query } = router

    if (Boolean(query?.s)) {
      setSortedBtnStyleSwitch(query.s)
    } else {
      setSortedBtnStyleSwitch('2')
    }
  }, [router.isReady])

  return <section className={classReader('p-4 p-lg-5 rounded border', { DashboardStyle: 'weekly-clicked-highlight' })}>
    <div className={classReader('d-flex justify-content-between mb-4', { DashboardStyle: 'header-wrapper' })}>
      <div className={classReader('mr-5')}>
        <div className={classReader('h5 bold')}>{labelText}</div>
        <div className={classReader('text-secondary mt-1 mb-3')}>7 Days Highlight</div>
      </div>
      <div>
        <Button
          label="查更多"
          className={classReader('m-0', { DashboardStyle: 'search-btn' })}
          onClick={() => router.push('/analysis/effect')}
        />
      </div>
    </div>

    {sortedBtnStyleSwitch === '1' && <SortedBtn sortedIndex={sortedIndex} setSortedIndex={(e) => setSortedIndex(e)}/>}
    
    {sortedBtnStyleSwitch === '2' && <div className={classReader('d-flex row', { DashboardStyle: 'sorted' })}>
      {
        SORTED_CONFIG.map( (item) => <SortedBtnStyle2 {...item} key={item.index}/>)
      }
    </div>}
    

    { data.length ? <>
      <div className={classReader('scrollbar-x relative-position pt-2')}>
        <div className={classReader({ DashboardStyle: 'table-loading rounded ' }, !isLoading && 'd-none')}>
          <ReactLoading
            className={classReader('my-5 m-auto loading-color')}
            type="spin"
            height={DEFAULT_SIZES.md * 2.5}
            width={DEFAULT_SIZES.md * 2.5}
          /> 
        </div>
        <div className={classReader('pb-3', { DashboardStyle: 'table' })}>
          <div className={classReader('text-secondary justify-content-center')}>建立日期</div>
          <div className={classReader('text-secondary')}>短網址</div>
          <div className={classReader('text-secondary')}>目標網址</div>
          <div className={classReader('text-secondary')}>短網址類別</div>
          <div className={classReader('text-secondary justify-content-end')}>總點擊量</div>
          {
            data.map((item, index) => <Fragment key={index}>
              <div className={classReader('border-top justify-content-center')}>{dateFormat(item.createDate)}</div>
              <div className={classReader('border-top d-block')}>
                <div className={classReader('d-flex align-items-center')}>
                  <div className={classReader('mr-1 border rounded-8 overflow-hidden')} name="img">
                    <div
                      className={classReader('img-default bg-gray')} 
                      style={{ backgroundImage: `url(${item.metaImage || '/imageNotFound.svg'})` }}
                    />
                  </div>
                  <div className={classReader('overflow-hidden')}>
                    <div className={classReader('text-lg bold pt-0 ellipsis')} name="title" title={item.title}>{item.title}</div>
                    <div className={classReader({ DashboardStyle: 'table__shortUrl' }, 'pt-1 text-nowrap')} title={decodeURIComponent(item.shortUrl)}>{decodeURIComponent(item.shortUrl)}</div>
                  </div>
                </div>
              </div>
              {/* <div className={classReader('border-top bold word-break')} name="destUrl" title={item.destUrl}>
                <p className={classReader('ellipsis-2-lines m-0')}>{item.destUrl}</p>
              </div> */}
              <div className={classReader('border-top bold word-break')} name="destUrl">
                {decodeURIComponent(item.destUrl)}
              </div>
              <div className={classReader('border-top')}>{TYPE_MAPPING[item.createKind]}</div>
              <div className={classReader('border-top text-right justify-content-end')}>
                <Link className={classReader('primary')}
                  href={`/analysis/effect/detail/${item.pairInfoId}`}>
                  <b><u>{thousandthsFormat(item.clickQty)}</u></b> 
                </Link>
              </div>
            </Fragment>)
          }
        </div>
      </div>
       
    </> : <div style={{ height: DEFAULT_SIZES.md * 2.5 }} className={classReader('d-flex flex-center my-5')}>
      <div className={classReader('text-secondary')}>查無資料</div>
    </div>
    }
  </section>
}
export default WeeklyCreatedRanking