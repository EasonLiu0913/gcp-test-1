import React, { memo } from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'
import { thousandthsFormat } from 'utils/valueFormat'

const RollingNumber = ({ number = 0 }) => {
  const splitNumber = thousandthsFormat(number).split('')

  return (
    <div className={classReader('rolling-number')}>
      {
        splitNumber.map( (digit, index) => {
          if (digit === ',') {
            return <div key={index}>,</div>
          } else {
            return <Digit key={index} digit={digit} index={index}/>
          }
        })
      }
    </div>
  )
}

const Digit = ({ digit, index }) => {
  return <div
    style={{ animationDelay: `${index * 0.1}s` }}
    className={classReader('digit', {
      'digit-1': digit === '1',
      'digit-2': digit === '2',
      'digit-3': digit === '3',
      'digit-4': digit === '4',
      'digit-5': digit === '5',
      'digit-6': digit === '6',
      'digit-7': digit === '7',
      'digit-8': digit === '8',
      'digit-9': digit === '9',
      'digit-0': digit === '0',
    })}>
    <div>0</div>
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
    <div>6</div>
    <div>7</div>
    <div>8</div>
    <div>9</div>
    <div>0</div>
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
    <div>6</div>
    <div>7</div>
    <div>8</div>
    <div>9</div>
    <div>0</div>
  </div>
}

RollingNumber.propTypes = { number: PropTypes.number }

export default memo(RollingNumber)