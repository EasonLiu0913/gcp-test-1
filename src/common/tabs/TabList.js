import React, { useRef, memo } from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'
import Separator from 'common/Separator'
import Tabs from 'common/tabs/Tabs'
import TabPanels from 'common/tabs/TabPanels'

const TabList = ({
  activeColor = 'primary',
  activeTab,
  activeTextColor,
  align,
  className,
  color = 'white',
  disabled = false,
  id,
  indicator = false,
  inlineLabel,
  onClick,
  panelClassName,
  panelColor,
  panelId,
  panelTextColor,
  separator = false,
  separatorColor,
  styleName = '',
  tabColor,
  tabData = [],
  tabTextColor,
  textColor = 'primary',
  vertical = false,  
}) => {

  const prevActiveTabIndex = useRef(0)

  const atTabClick = (newActiveTab, prevActiveIndex) => {
    prevActiveTabIndex.current = prevActiveIndex
    onClick(newActiveTab)
  }

  return (
    <section className={classReader('tabs', { 'no-wrap row': vertical })}>
      <Tabs
        className={classReader(className)}
        styleName={styleName}
        id={id}
        activeTab={activeTab}
        tabData={tabData}
        align={align}
        vertical={vertical}
        indicator={indicator}
        inlineLabel={inlineLabel}
        disabled={disabled}
        activeColor={activeColor}
        activeTextColor={activeTextColor}
        tabColor={tabColor || color}
        tabTextColor={tabTextColor || textColor}
        onClick={atTabClick}
      />

      {separator && (
        <Separator vertical={vertical} color={separatorColor || activeColor} />
      )}

      <TabPanels
        className={classReader(panelClassName)}
        id={panelId}
        activeTab={activeTab}
        prevActiveTabIndex={prevActiveTabIndex.current}
        panels={tabData}
        vertical={vertical}
        panelColor={panelColor || color}
        panelTextColor={panelTextColor || textColor}
      />
    </section>
  )
}

TabList.propTypes = {
  activeColor: PropTypes.string,
  activeTab: PropTypes.string,
  activeTextColor: PropTypes.string,
  align: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  indicator: PropTypes.bool,
  inlineLabel: PropTypes.bool,
  onClick: PropTypes.func,
  panelClassName: PropTypes.string,
  panelColor: PropTypes.string,
  panelId: PropTypes.string,
  panelTextColor: PropTypes.string,
  separator: PropTypes.bool,
  separatorColor: PropTypes.string,
  styleName: PropTypes.string,
  tabColor: PropTypes.string,
  tabData: PropTypes.array,
  tabTextColor: PropTypes.string,
  textColor: PropTypes.string,
  vertical: PropTypes.bool,  
}

export default memo(TabList)
