/*
 * UI component - Card 卡片 (外框)
 *  props
 *   ├ className (string): 添加 / 覆蓋樣式
 *   ├ id (string): 用於增加識別
 *   ├ border (boolean): 是否開啟線框樣式，預設 false
 *   └ children (node): 卡片內容
 *
 *  補充
 *   ├ 不要陰影可給 "shadow-0" 的 className
 *   └ 與 CardSection 搭配，也可分開使用
 */

import React, { memo } from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'

const Card = ({
  border = false,
  children,
  className,
  id,
  width,
}) => {

  return (
    <section
      className={classReader(
        'card card--size',
        { 'card--bordered': border },
        className, 
      )}
      style={{ width }}
      id={id}
    >
      {children}
    </section>
  )
}

Card.propTypes = {
  border: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
  width: PropTypes.number,
}

export default memo(Card)
