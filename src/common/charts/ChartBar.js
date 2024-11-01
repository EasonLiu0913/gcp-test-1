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

const ChartBar = ({
  barValue = false,
  className,
  id,
  inverted = false,
  options = [],
  optionLabel = '',
  subTitle = '',
  title = '',
  unitLable = '',
  unit = '',
}) => {

  HighchartsMore(Highcharts)
  Exporting(Highcharts)
  
  const maxNum = 12
  let max = Math.max(...options.map(item => item.value))
  max = max < maxNum ? maxNum : null

  const [highchartOptions, setHighchartOptions] = useState({})

  useEffect(() => {
    if (options.length > 0) {
      const maxNum = 12
      const max = Math.max(...options.map(item => item.value)) < maxNum ? maxNum : null

      setHighchartOptions({
        ...HIGHCHARTS_CONFIG,
        chart: {
          type: inverted ? 'bar' : '',
          inverted: inverted,
          polar: false,
        },
        title: {
          text: title,
          align: 'center', 
        },
        subtitle: {
          text: subTitle,
          align: 'center',
        },
        xAxis: {
          categories: options.map(item => item.label),
          title: { text: null },
          type: 'linear', 
          allowDecimals: false, // 禁止在軸上顯示小數
          tickInterval: 1, // 強制每個刻度間隔為1
        },
        yAxis: {
          min: 0,
          max: max,
          title: {
            text: optionLabel,
            align: 'high',
          },
          labels: { overflow: 'justify' },
        },
        tooltip: { valueSuffix: ` ${unit}` },
        plotOptions: {
          bar: { dataLabels: { enabled: true } },
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: barValue,
              format: '{point.y}',
            },
          },
        },
        colors: ['#539BFF'],
        series: [
          {
            type: 'column',
            borderRadius: 5,
            colorByPoint: true,
            showInLegend: false,
            name: unitLable,
            data: options.map(item => item.value),
          },
        ],
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

ChartBar.propTypes = {
  barValue: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
  inverted: PropTypes.bool,
  options: PropTypes.array,
  optionLabel: PropTypes.string,
  subTitle: PropTypes.string,
  title: PropTypes.string,
  unit: PropTypes.string,
  unitLable: PropTypes.string,
}

export default memo(ChartBar)
