import React, { useEffect, useRef } from 'react'
import CardSection from 'common/card/CardSection'
import classReader from 'utils/classReader'
import { thousandthsFormat } from 'utils/valueFormat'
const RatingCard = ({
  data,
  engTitle,
  title,
}) => {

  return (
    <CardSection className={classReader({ ShortenerStyle: 'rating-card' })}>
      <div className={classReader({ ShortenerStyle: 'rating-card__title' })}>{title}</div>
      <div className={classReader('text-secondary mb-3')}>{engTitle}</div>
      <div className={classReader({ ShortenerStyle: 'rating-card__list' })}>
        {data.map((item, key) => <div key={key} className={classReader('d-flex py-3 flex-between')}>
          <div className={classReader('d-flex flex-center')}>
            <i className={classReader('icon icon-apps', {
              'icon-blue': key === 0,
              'icon-green': key === 1,
              'icon-orange': key === 2,
              'icon-gray-6': key > 2,
            })} />
            <div className={classReader('bold')}>{item.name}</div>
          </div>
          <div className={classReader('bold', { ShortenerStyle: 'badge' })}>
            {thousandthsFormat(item.quantity)}
          </div>
        </div>)}
      </div>
    </CardSection>
  )
}

export default RatingCard