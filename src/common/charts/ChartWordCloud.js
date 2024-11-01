import React, {
  useEffect, useState, memo, 
} from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import wordCloud from 'highcharts/modules/wordcloud.js'
import HighchartsMore from 'highcharts/highcharts-more'
import Exporting from 'highcharts/modules/exporting'
import { HIGHCHARTS_CONFIG } from 'config/highcharts'

const ChartWordCloud = ({
  className,
  id,
  options = [],
  subTitle = '',
  title = '',
}) => {

  HighchartsMore(Highcharts)
  Exporting(Highcharts)
  wordCloud(Highcharts)

  const [highchartOptions, setHighchartOptions] = useState({})

  useEffect(() => {
    if (options.length > 0) {
      setHighchartOptions({
        ...HIGHCHARTS_CONFIG,
        title: { text: title },
        subtitle: { text: subTitle },
        series: [
          {
            type: 'wordcloud',
            data: options,
            name: 'uniqueUsers',
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

ChartWordCloud.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  options: PropTypes.array,
  subTitle: PropTypes.string,
  title: PropTypes.string,
}

export default memo(ChartWordCloud)
