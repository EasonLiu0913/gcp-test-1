import React from 'react'
import classReader from 'utils/classReader'
import PropTypes from 'prop-types'
import CardSection from 'common/card/CardSection'
import ChartWordCloud from 'src/common/charts/ChartWordCloud'

const LabelWordCloud = ({
  className = '',
  id = '',
  options = [], 
  subTitle = '',
  title = '',
}) => {

  return <>    
    <CardSection id={id} className={classReader({ AnalysisStyle: 'label-chart' }, className)}>
      {options && <ChartWordCloud
        title={title}
        subTitle={subTitle}
        options={options} 
      />}
    </CardSection>
  </>
}

LabelWordCloud.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  options: PropTypes.array,
}

export default LabelWordCloud