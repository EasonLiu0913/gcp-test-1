
import React, { memo } from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'
import { thousandthsFormat } from 'utils/valueFormat'

const AnalysisCard = ({
  cardData = [],
  className,
  id,
}) => {

  return (
    <div
      className={classReader({ AnalysisStyle: 'analysis-card__item' }, className)}
      id={id}
    >
      <div className={classReader('border rounded-8 p-2')}>
        <div className={classReader('border rounded-8 overflow-hidden mb-2')}>
          <div 
            className={classReader('bg-gray w-100 img__aspect-ratio img__aspect-ratio-cover img__aspect-ratio-191-1')} 
            style={{ backgroundImage: `url(${cardData.img || '/imageNotFound.svg'})` }}
          ></div>
        </div>

        {cardData.sort && <div className={classReader('mt-3 mb-2 text-xs')}>
          <span className={classReader(
            'p-1 white', 
            cardData.sort <= 3 && `bg-blue opacity-${ 12 - (cardData.sort * 2)}`,
            // cardData.sort === 1 && 'bg-primary',
            // cardData.sort === 2 && 'bg-blue',
            // cardData.sort === 3 && 'bg-secondary',
            cardData.sort > 3 && 'bg-gray-5 black',
          )}><b>{`TOP ${cardData.sort}`}</b></span>
        </div>}

        {Boolean(cardData.title) && <p className={classReader('mb-1 text-sm text-sm-md ellipsis')} title={cardData.title}>{cardData.title}</p>}

        {Boolean(cardData.desc) && <p className={classReader('mb-1 mt-1 ellipsis text-sm')} title={cardData.desc}>{cardData.desc}</p>}
        
        {(Boolean(cardData.click) || Boolean(cardData.uu)) && <div className={classReader('row pt-1')}>
          <div className={classReader('col-6 text-sm text-md-md mb-1 mb-sm-2')}>Click</div>
          <div className={classReader('col-6 text-right text-md-md text-sm mb-1 mb-sm-2 ')}>{Boolean(cardData.click) ? thousandthsFormat(cardData.click) : 0}</div>
          <div className={classReader('col-6 text-sm text-md-md mb-1 mb-sm-2')}>uu</div>
          <div className={classReader('col-6 text-right text-sm text-md-md mb-1 mb-sm-2 ')}>{Boolean(cardData.uu) ? thousandthsFormat(cardData.uu) : 0}</div>
        </div>}
        
      </div>
    </div>
  )
}

AnalysisCard.propTypes = {
  cardData: PropTypes.object,
  className: PropTypes.string,
  id: PropTypes.string,
}

export default memo(AnalysisCard)