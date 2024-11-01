import React, { useEffect, useState } from 'react'
import classReader from 'utils/classReader'
import CardSection from 'common/card/CardSection'
import ChartBar from 'common/charts/ChartBar'

const LabelChartBar = ({
  barValue,
  className,
  id,
  inverted,
  optionLabel,
  options, 
  subTitle,
  title,
  unitLable,  
}) => {

  return <>    
    <CardSection id={id} className={classReader({ AnalysisStyle: 'label-chart' }, className)}>
      {options && <ChartBar 
        title={title} 
        subTitle={subTitle}
        unitLable={unitLable} 
        optionLabel={optionLabel}
        options={options} 
        inverted={inverted}
        barValue={barValue}
      />}
    </CardSection>
  </>
}

export default LabelChartBar