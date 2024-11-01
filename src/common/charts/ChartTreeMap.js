import React, {
  useEffect, useState, memo, 
} from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import TreeMap from 'highcharts/modules/treemap'
import HighchartsMore from 'highcharts/highcharts-more'
import Exporting from 'highcharts/modules/exporting'
import { HIGHCHARTS_CONFIG } from 'config/highcharts'

const ChartTreeMap = ({
  className,
  id,
  options = [],
  optionLabel = '',
  subTitle = '',
  title = '',
}) => {

  HighchartsMore(Highcharts)
  Exporting(Highcharts)
  TreeMap(Highcharts)
  
  const [highchartOptions, setHighchartOptions] = useState({})

  useEffect(() => {
    if (options.length > 0) {
      setHighchartOptions({
        ...HIGHCHARTS_CONFIG,
        series: [
          {
            type: 'treemap',
            layoutAlgorithm: 'squarified',
            data: options,
          },
        ],
        title: { text: title },
        subtitle: { text: subTitle },
        tooltip: { pointFormat: `${optionLabel}: {point.value}` },
        colorAxis: {
          minColor: '#FFFFFF',
          maxColor: Highcharts.getOptions().colors[0],
        },
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true,
              style: { fontSize: '12px' }, // 圖表內文字大小
            },
          },
        },

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

ChartTreeMap.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  options: PropTypes.array,
  optionLabel: PropTypes.string,
  subTitle: PropTypes.string,
  title: PropTypes.string,
}

export default memo(ChartTreeMap)
