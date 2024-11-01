import React, { useState } from 'react'
import {
  handleHeadParams,
  lastSegmentOfURL, 
} from 'utils/util'
import { thousandthsFormat } from 'utils/valueFormat'
import classReader from 'utils/classReader'
import Input from 'common/form/Input'
import Button from 'common/Button'
import {
  BarChart, Bar, Rectangle, XAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import dashboardAPI from 'apis/dashboard'
import { rules } from 'utils/validation'
import { useForm } from 'react-hook-form'
import { USE_FORM_CONFIG } from 'config/config'
import { useError } from 'context/ErrorContext'
import { hookFormValidates } from 'utils/hookFormValidates'
import {
  isAfterDate,
  dateTimeFormat,
  handleDateFormat,
} from 'utils/date'
import { useSnackbar } from 'notistack'

export async function getServerSideProps(context) {
  const headParams = handleHeadParams(context)
  return { props: { ...headParams } }
}

const ToolTip = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {

    const dateTime = handleDateFormat({
      dateTime: payload[0].payload.date,
      format: 'YYYY-MM-DD HH:00',
    })
     
    return (
      <div className={classReader('p-4')}>
        <div className={classReader('mb-1 bold')}>時間：{dateTime}</div>
        <div className={classReader('mb-1 bold')}>點擊數：{thousandthsFormat(payload[0].value)}</div>
      </div>
    )
  }
}

const DailyHighlight = () => {
  const [data, setData] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { reportError } = useError()
  const { enqueueSnackbar } = useSnackbar()
  const {
    register, handleSubmit, formState: { errors },
  } = useForm({
    ...USE_FORM_CONFIG,
    mode: 'onSubmit',
  })
  
  const handleSearch = async ({ code }) => {
    setIsSubmitting(true)
    try {
      code = code.trim()
      const params = {
        qty: 24,
        code: code,
        clickQtySortBy: 'DESC',
      }
      const result = await dashboardAPI.last24HoursTracking(params)
      const { data, success } = result
      if (!success) return reportError({ errorNo: result.errorNo || 9999 })
      if (!data || data.length === 0) return setData([])

      // 整理現有資料
      let timeList = result.data?.sort( (a, b) => {
        return isAfterDate(a.startDate, b.startDate) ? 1 : -1
      }).map( item => {
        const dataTime = item.startDate.replace(/\.\d+Z|Z/, '').replace(/T/, ' ')
        const hours = dataTime.replace(/[\d-]+ /, '').replace(/\:00:00/, '')

        return {
          date: dataTime,
          time: hours,
          count: item.clickQty,
        }
      }) ?? []

      const lookup = new Map(timeList.map(item => [item.date, item.count]))
      
      // 取得目前時間
      const last24HoursStart = dateTimeFormat('now')

      // 往前計算24小時
      let chartData = []
      for (let i = 0; i <= 24; i++) {
        const dateKey = handleDateFormat({
          dateTime: last24HoursStart,
          add: 0 - i,
          unit: 'h',
          format: 'YYYY-MM-DD HH:00:00',
        })

        let count = lookup.has(dateKey) ? lookup.get(dateKey) : 0
  
        chartData.push({
          date: handleDateFormat({
            dateTime: last24HoursStart,
            add: 0 - i,
            unit: 'h',
            format: 'YYYY-MM-DD HH:00:00',
          }),
          time: handleDateFormat({
            dateTime: last24HoursStart,
            add: 0 - i,
            unit: 'h',
            format: 'HH:00',
          }),
          count: count,
        })
      }

      // 排序顛倒，左側最舊，右側最新
      chartData.reverse()
      setData(chartData)
 
    } catch (err) {
      if (parseInt(err.errorNo) === 3){
        enqueueSnackbar('「24小時點擊狀況」目前無資料', { className: classReader('success bg-success-light') })
      } else reportError(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return <section className={classReader('border p-4 p-lg-5 rounded', { DashboardStyle: 'daily-highlight' })}>
    <div className={classReader('d-flex justify-content-between mb-4', { DashboardStyle: 'header-wrapper' })}>
      <div className={classReader('mr-5')}>
        <div className={classReader('h5 bold')}>近24小時的點擊狀況</div>
        <div className={classReader('text-secondary mt-1 mb-3')}>整點更新</div>
      </div> 
      <div className={classReader({ DashboardStyle: 'search-bar-wrapper' })}>
        <div className={classReader('d-flex')}>
          <Input
            placeholder="請輸入短網址 or 代碼"
            className={classReader('mb-0', { DashboardStyle: 'search-bar' })}
            register={register}
            name="code"
            validate={hookFormValidates().codeRequired}
            controllerError={errors?.code?.message}
          />
          <Button 
            label="搜尋" 
            className={classReader('mr-0', { DashboardStyle: 'search-btn' })}
            onClick={handleSubmit(handleSearch)}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </div>
    <div className={classReader({ DashboardStyle: 'chart' })}>
      { data === null ?
        <div className={classReader('text-secondary d-flex flex-center h-100')}>請先在上方搜尋短網址</div> :
        data.length ?
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="time" axisLine={false} tickLine={false}/>
              <Tooltip content={<ToolTip />} cursor={{ fill: 'transparent' }}/>
              <Bar
                dataKey="count"
                fill="#49BEFF"
                radius={20}
                maxBarSize={25}
                activeBar={<Rectangle fill="#5D87FF" />}
              />
            </BarChart>
          </ResponsiveContainer> 
          : <div className={classReader('error d-flex flex-center h-100')}>查無該短網址的相關數據</div>
      }
    </div>
  </section>
}
export default DailyHighlight