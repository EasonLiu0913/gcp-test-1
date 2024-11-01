import React from 'react'
import classReader from 'utils/classReader'
import CardSection from 'common/card/CardSection'
import ChartTreeMap from 'src/common/charts/ChartTreeMap'

const LabelTreeMap = ({
  className,
  id,
  optionLabel,
  options, 
  subTitle,
  title,  
}) => {

  return <>    
    <CardSection id={id} className={classReader({ AnalysisStyle: 'label-chart' }, className)}>
      {options && <ChartTreeMap
        title={title}
        subTitle={subTitle}
        optionLabel={optionLabel}
        options={options} 
      />}
    </CardSection>
  </>
}

export default LabelTreeMap