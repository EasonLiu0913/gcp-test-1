import React, { useState, useEffect } from 'react'
import { handleHeadParams } from 'utils/util'
import classReader from 'utils/classReader'
import RollingNumber from 'common/RollingNumber'
import dashboardAPI from 'apis/dashboard'
import { useError } from 'context/ErrorContext'
import { useSnackbar } from 'notistack'

export async function getServerSideProps(context) {
  const headParams = handleHeadParams(context)
  return { props: { ...headParams } }
}

const SummaryCard = (props) => {
  return <div className={classReader(`py-4 bg-${props.color}-light ${props.color} rounded`,
    { DashboardStyle: 'summary-card' })}>
    <div className={classReader('h3 pb-2 w-fit m-auto bold')}>
      <RollingNumber number={props.count}/>
    </div>
    <div>{props.label}</div>
  </div>
}

const SingleCard = () => {
  const [singleCount, setSingleCount] = useState(0)
  const { reportError } = useError()
  const { enqueueSnackbar } = useSnackbar()
  const labelText = '近7天單一短網址數量'

  const getSingleCreated = async () => {
    try {
      const result = await dashboardAPI.getSingleCreated()
      if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })
      setSingleCount(result.data)
    } catch (err) {
      if (parseInt(err.errorNo) === 3) enqueueSnackbar(`「${labelText}」目前無資料`, { className: classReader('success bg-success-light') })
      else reportError(err)
    } 
  }

  useEffect(() => {
    getSingleCreated()
  }, [])

  return <SummaryCard count={singleCount} label={labelText} color="info" />
}

const BatchCard = () => {
  const [batchCount, setBatchCount] = useState(0)
  const { reportError } = useError()
  const { enqueueSnackbar } = useSnackbar()
  const labelText = '近7天量產短網址數量'

  const getBatchCreated = async () => {
    try {
      const result = await dashboardAPI.getBatchCreated()
      if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })
      setBatchCount(result.data)
    } catch (err) {
      if (parseInt(err.errorNo) === 3) enqueueSnackbar(`「${labelText}」目前無資料`, { className: classReader('success bg-success-light') })
      else reportError(err)
    }
  }

  useEffect(() => {
    getBatchCreated()
  }, [])

  return <SummaryCard count={batchCount} label={labelText} color="warning" />
}

const IndividualCard = () => {
  const [individualCount, setIndividualCount] = useState(0)
  const { enqueueSnackbar } = useSnackbar()
  const labelText = '近7天1:1個人化短網址數量'

  const getIndividualCreated = async () => {
    try {
      const result = await dashboardAPI.getIndividualCreated()
      if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })
      setIndividualCount(result.data)
    } catch (err) {
      if (parseInt(err.errorNo) === 3) enqueueSnackbar(`「${labelText}」目前無資料`, { className: classReader('success bg-success-light') })
      else reportError(err)
    }
  }

  useEffect(() => {
    getIndividualCreated()
  }, [])

  return <SummaryCard count={individualCount} label={labelText} color="success" />
}

const TotalCard = ({ totalClick = 0 }) => {
  const labelText = '近7天所有點擊數'
  return <SummaryCard count={totalClick} label={labelText} color="error"/>
}

const Summary = ({ totalClick = 0 }) => {
  //全部拆開減少彼此useEffect 取完資料後又再re-render 彼此
  return <section className={classReader('text-center', { DashboardStyle: 'summary' })}>
    <SingleCard />
    <BatchCard />
    <IndividualCard />
    <TotalCard totalClick={totalClick}/>
  </section>
}
export default Summary