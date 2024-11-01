/*
 * ↓↓↓ 基本控制 ↓↓↓
 * align : 靠齊位置
 * background : 背板顏色開關，true / falses
 * breakpoint : PC 斷點，可選 [sm, md, lg, xl, xxl, xxxl]，對應 _variable.scss $container-max-widths
 * children : 內容區塊
 * className : Style
 * id : 區塊名稱，方便 GTM 紀錄數據
 * onClosePopup : 關閉
 * onTogglePopup : 開啟
 * prompt : 開關，true / falses
 * slideIn : Popup 由哪個方向進入可視區，top, bottom , left(預設), right, center
 * title : 區塊 title，會再關閉右側顯示
 * fadeIn : 淡入，true / falses
 */
import React, { memo } from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'

const Popup = ({
  align = 'left',
  background = false,
  breakpoint = 'xl',
  children,
  className,
  fadeIn = false,
  full = false,
  headerClass = 'd-xl-none',
  id,
  onClosePopup = () => {},
  onTogglePopup = () => {},
  prompt = false,
  slideIn = 'left',
  title = null,
}) => {

  return (
    <section
      id={id}
      className={classReader(
        'popup d-flex overflow', 
        `popup--slideIn-${slideIn}`,
        `popup--align-${align}`,
        { 'popup--fadeIn': fadeIn },
        className,
      )}
      data-active={prompt}
      data-bg={background}
    >
      <div className={classReader('popup__bg', { 'popup__bg--colored': background })} onClick={onClosePopup}
      />
      <div className={classReader(`popup__main popup__main--${breakpoint}`)} data-full={full}>
        <div className={classReader('popup__header d-flex align-items-center public-padding', headerClass)}>
          <i className={classReader('icon icon-close cursor-pointer')} onClick={onClosePopup}/>
          {title && <h4 className={classReader('h4 pl-3 m-0')}>{title}</h4>}
        </div>
        <div className={classReader('popup__content scrollbar-y')}>
          {children}
        </div>
      </div>
    </section>
  )
}

Popup.propTypes = {
  align: PropTypes.string,
  background: PropTypes.bool,
  breakpoint: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  fadeIn: PropTypes.bool,
  full: PropTypes.bool,
  headerClass: PropTypes.string,
  id: PropTypes.string,
  onClosePopup: PropTypes.func,
  onTogglePopup: PropTypes.func,
  prompt: PropTypes.bool,
  slideIn: PropTypes.string,
  title: PropTypes.node,  
}

export default memo( Popup )