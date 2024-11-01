import React, {
  useRef,
  useEffect,
  memo,
} from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'

const TabPanel = ({
  activeTab,
  className,
  id,
  panelColor = 'white',
  panels = [],
  panelTextColor = 'primary',
  prevActiveTabIndex,
  vertical = false,  
}) => {

  const tabPanelsRef = useRef(null)

  const handleAnimeSide = (index) => {
    let positionSide = 'center-side'
    if (prevActiveTabIndex !== void 0 && prevActiveTabIndex !== index) {
      if (vertical) {
        positionSide = prevActiveTabIndex > index ? 'top-side' : 'bottom-side'
      } else {
        positionSide = prevActiveTabIndex > index ? 'left-side' : 'right-side'
      }
    }

    return positionSide
  }

  // NOTE: 當父層底下有 Tab 元件時不執行子層動畫，避免父子層的動畫疊加造成視覺混亂
  // FIXME: 待確認 panelChildTab 邏輯
  useEffect(() => {
    const panelChildTab = tabPanelsRef.current.querySelector('.tabs__tab-panels')
    if (panelChildTab) {
      const childPanel = panelChildTab.querySelector('.tabs__tab-panel[data-active="true"]') // FIXME: classReader 處理
      childPanel.classList.add(classReader('tabs__tab-panel--stop-anime'))
    }
  }, [activeTab])

  return (
    <div
      ref={tabPanelsRef}
      className={classReader(
        'tabs__tab-panels col p-0',
        `bg-${panelColor} text-${panelTextColor}`,
        className,
      )}
      id={id}
    >
      {panels?.map((item, index) => {
        const positionSide = handleAnimeSide(index)
        const colorSet = `bg-${item.panelColor || panelColor} text-${item.panelTextColor || panelTextColor}`
        return (
          <div
            key={item.name}
            className={classReader(
              'tabs__tab-panel', `tabs__tab-panel--${positionSide}`, colorSet,
            )}
            data-active={activeTab === item.name}
          >
            {
              typeof item.panel === 'string'
                ? (<div className={classReader('py-2 px-3')}>{item.panel}</div>)
                : (<>{item.panel}</>)
            }
          </div>
        )
      })}
    </div>
  )
}

TabPanel.propTypes = {
  activeTab: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
  panelColor: PropTypes.string,
  panels: PropTypes.array,
  panelTextColor: PropTypes.string,
  prevActiveTabIndex: PropTypes.number,
  vertical: PropTypes.bool,  
}

export default memo(TabPanel)
