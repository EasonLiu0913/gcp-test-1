import React from 'react'
import classReader from 'utils/classReader'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, LabelList, Legend, Bar,
} from 'recharts'
import CardSection from 'common/card/CardSection'

const RenderCustomizedLabel = ({
  x, y, width, value, 
}) => {
  const size = 60

  return (
    <g>
      {/* <image x={x + width / 2 - size / 2} y={y - size / 2} width={size} height={size} href={value} /> */}
    </g>
  )
}

const LabelChart = ({ data }) => {

  return <>
    <CardSection className={classReader('scrollbar-x')}>
      <div className={classReader({ AnalysisStyle: 'label-chart label-chart__recharts' })}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 30,
              right: 30,
              left: 30,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="chtTag" interval={0}/>
            <YAxis />
            <Tooltip cursor={false}/>
            <Bar dataKey="uniqueUsers" fill="#49BEFF" minPointSize={5} activeBar={{ fill: '#5D87FF' }}>
              <LabelList dataKey="imageUrl" content={RenderCustomizedLabel} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardSection>
  </>
}

export default LabelChart