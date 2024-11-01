/*
 * UI component - CardSection 卡片內框
 *  props
 *   ├ className (string): 添加 / 覆蓋樣式
 *   ├ id (string): 用於增加識別
 *   ├ horizontal (boolean): 是否讓內容水平並排，預設 false
 *   └ children (node): 卡片內框內容
 *
 *  補充
 *   ├ horizontal 圖片圓角設定與 UI 設計有衝突，因此目前 'card__section--horiz' css 都註解掉
 *   └ 與 Card 搭配，也可分開使用
 */

import React, { memo } from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'

const CardSection = ({
  children,
  className,
  header = false,
  headerText,
  hide = true,
  horizontal = false,
  id,
}) => {

  return (
    <div
      className={
        classReader('card__section',
          horizontal ? 'card__section--horiz row no-wrap' : 'card__section--vert')}
      id={id}
    >
      {header && <div className={classReader('card__section__header px-2 pb-3')}>
        <div className={classReader('card__section__header__title border-bottom pb-3', hide && 'pr-5')}><b>搜尋</b></div>
        <div className={classReader('card__section__header__hide cursor-pointer pr-2')} data-hide={hide}>
          <i className={classReader(`icon icon-arrow-${hide ? 'up' : 'down'}`)} />
        </div> 
      </div>}
      <div className={classReader('card__section__content', className)} data-hide={hide}>
        {children}
      </div>
    </div>
  )
}

CardSection.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  header: PropTypes.bool,
  headerText: PropTypes.string,
  hide: PropTypes.bool,
  horizontal: PropTypes.bool,
  id: PropTypes.string,
}

export default memo(CardSection)
