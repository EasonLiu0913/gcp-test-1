import React from 'react'
import classReader from 'utils/classReader'
import CardSection from 'common/card/CardSection'
import ChartPackedBubble from 'common/charts/ChartPackedBubble'

const LabelPackedBubble = ({
  className,
  dataLabels,
  fontSize,
  id,
  options, 
  subTitle,
  textPath,
  title,  
}) => {

  return <>    
    <CardSection id={id} className={classReader({ AnalysisStyle: 'label-chart' }, className)}>
      {options && <ChartPackedBubble 
        title={title}
        subTitle={subTitle}
        options={options} 
        textPath={textPath}
        fontSize={fontSize}
        dataLabels={dataLabels}
      />}
    </CardSection>
  </>
}

export default LabelPackedBubble
