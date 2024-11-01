import React, {
  useEffect, useState, memo, 
} from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HighchartsMore from 'highcharts/highcharts-more'
import Exporting from 'highcharts/modules/exporting'
import { HIGHCHARTS_CONFIG } from 'config/highcharts'

const ChartPackedBubble = ({ 
  className,
  dataLabels = true,
  fontSize = '10px',
  id,
  options = [], 
  subTitle = '',
  textPath = false,
  title = '',
}) => {
  HighchartsMore(Highcharts)
  Exporting(Highcharts)

  const [highchartOptions, setHighchartOptions] = useState({})

  useEffect(() => {
    if (options.length > 0) {
      setHighchartOptions({
        ...HIGHCHARTS_CONFIG,
        chart: {
          type: 'packedbubble',
          height: '500px',
        },
        tooltip: {
          useHTML: true,
          pointFormat: '<b>uniqueUsers:</b> {point.value}',
        },
        accessibility: { enabled: true }, // 氣泡內文字
        plotOptions: {
          packedbubble: {
            // minSize: '1%',
            // maxSize: '100%',
            zMin: 0,
            layoutAlgorithm: {
              splitSeries: false,
              gravitationalConstant: 0.02,
            },
            dataLabels: {
              enabled: dataLabels,
              textPath: { enabled: textPath }, // 文繞效果
              format: '{point.name}',
              style: {
                color: 'black',
                fontSize: fontSize,
                textOutline: 'none',
                fontWeight: 'normal',
              },
            },
          },
        },
        title: { text: title },
        subtitle: { text: subTitle },
        series: options,
      })
    }
  }, [options])

  return <div id={id} className={classReader(className)}>
    <HighchartsReact 
      highcharts={Highcharts}
      options={highchartOptions}
    />
  </div>
}

ChartPackedBubble.propTypes = { 
  className: PropTypes.string,
  dataLabels: PropTypes.bool,
  fontSize: PropTypes.string,
  id: PropTypes.string,
  options: PropTypes.array,
  subTitle: PropTypes.string,
  textPath: PropTypes.bool,
  title: PropTypes.string,
}

export default memo(ChartPackedBubble)
