import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import classReader from 'utils/classReader'
import CardSection from 'common/card/CardSection'

const CountAreaChart = ({ 
  chartHeaderClassName,
  chartHeaderChildren,
  data,
}) => {

  return (
    <CardSection>
      {chartHeaderChildren && <div className={classReader(chartHeaderClassName)}>
        {chartHeaderChildren}
      </div>}
      <div className={classReader({ ShortenerStyle: 'count-area-chart' })}>
        {
          data.length ? <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time"/>
              <YAxis allowDecimals={false}/>
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#5D87FF" fill="#49BEFF" />
            </AreaChart>
          </ResponsiveContainer> :
            <div className={classReader('h-100 text-secondary d-flex flex-center')}>
            查無日期區間內點擊次數資料
            </div>
        }
      </div>
    </CardSection>
  )
}

export default CountAreaChart