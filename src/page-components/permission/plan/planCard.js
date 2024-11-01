import React from 'react'
import Card from 'common/card/Card'
import classReader from 'utils/classReader'
import { thousandthsFormat } from 'utils/valueFormat'

const PlanCard = ({
  planContent,
  planName,
  price,
  status,
  tag,  
}) => {
  return (
    <Card className={classReader('overflow-hidden', { PermissionStyle: 'plan-card' })}>
      {status === 0 && <div className={classReader({ PermissionStyle: 'disabled' })} /> }
      <div className={classReader('text-h3 text-center white bg-primary p-3', { PermissionStyle: 'plan-card__title' })}>{planName}</div>

      <div className={classReader({ PermissionStyle: 'plan-card__content' }, 'pl-xxl-3 pr-xxl-3')}>
        <div>
          <div className={classReader('h5 text-center p-3')}>
            <span>$</span>
            <span className={classReader('h2')}>{thousandthsFormat(price)}</span>
            <span>/月</span>
          </div>
          <div className={classReader('p-3')}>
            {planContent.map( (item, index) => {
              return <div key={index} className={classReader('my-2 d-flex align-items-center')}>
                <i className={classReader('icon icon-done icon-green mr-1')} />
                <span className={classReader('text-secondary')}>{item}</span>
              </div>
            })}
          </div>
        </div>
        <div className={classReader({ PermissionStyle: 'tags-section' }, 'p-3')}>
          {tag?.map((item, index) => {
            if (item !== '' ) {
              return <div key={index} className={classReader('text-tag')}>{item}</div>
            }
          })}
        </div>
      </div>
    </Card>

  )
}

export default PlanCard