import React from 'react'
import CardSection from 'common/card/CardSection'
import classReader from 'utils/classReader'
import Image from 'next/image'
import RollingNumber from 'common/RollingNumber'

const RelatedCard = ({
  chtTag,
  imageUrl,
  title,
  uniqueUsers,
}) => {
  return <div className={classReader({ AnalysisStyle: 'related-card' })}>
    <Image src={imageUrl} width={250} height={150} alt="related picture"/>
    <div className={classReader('p-1', { AnalysisStyle: 'info' })}>
      <div className={classReader('h6 bold px-2 py-4', { AnalysisStyle: 'title' })}>{chtTag}</div>
      <div>
        <div className={classReader('h1 p-2 mx-auto', { AnalysisStyle: 'rank' })}>{title}</div>
        {
          uniqueUsers && <div className={classReader('text-secondary h5 p-2 text-center', { AnalysisStyle: 'count' })}>
            <RollingNumber number={uniqueUsers}/>
          </div>
        }
      </div>
    </div>
  </div>
}


const RelatedRow = ({ data, title }) => {
  return (
    <CardSection className={classReader('p-4', { AnalysisStyle: 'related-row' })}>
      <div className={classReader('h4 bold mb-4')}>{title}</div>
      <div className={classReader({ AnalysisStyle: 'flex' })}>
        {data.map( (item, index) => <RelatedCard key={index} {...item} rank={index + 1}/>)}
      </div>
    </CardSection>
  )
}

export default RelatedRow