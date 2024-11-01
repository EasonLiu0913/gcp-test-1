import React, { useRef, memo } from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'

const Tabs = ({
  activeColor,
  activeTab,
  activeTextColor,
  align,
  className,
  disabled = false,
  id,
  indicator = false,
  inlineLabel = false,
  onClick = () => {},
  styleName = '',
  tabColor = 'white',
  tabData = [],
  tabTextColor = 'primary',
  vertical = false,
}) => {

  const prevActiveTabIndex = useRef(0)
  const prevActiveTab = useRef('')

  const handleOnTabClick = (newActiveTab) => {
    const prevIndex = tabData.findIndex(item => item.name === activeTab)
    prevActiveTabIndex.current = prevIndex
    prevActiveTab.current = activeTab
    onClick(newActiveTab, prevActiveTabIndex.current)
  }

  return (
    <ul
      className={classReader(
        'tabs__tab-list row col-auto',
        `tabs--${vertical ? 'vertical' : 'horizontal'}`,
        `${align ? `justify-content-${align}` : 'tabs--horizontal-full'}`,
        className,
      )}
      id={id}
    >
      {tabData?.map(item => {
        const isDisabled = disabled || item.disabled === true
        const isActive = activeTab === item.name
        const indicatorSide = vertical ? 'right' : 'bottom'
        const actionSet = isDisabled ? 'disabled' : 'focusable hoverable'
        const inlineSet = inlineLabel ? 'tabs__tab--inline-label' : 'tabs__tab-label'

        const textColor = isActive ? item.activeTextColor || activeTextColor : item.tabTextColor || tabTextColor
        let colorSet = `bg-${item.tabColor || tabColor} text-${textColor}`
        if (isActive && indicator === false) {
          colorSet = `bg-${item.activeColor || activeColor || item.tabTextColor || tabTextColor} text-${item.activeTextColor || activeTextColor || 'white'}`
        }


        return (
          <li key={item.name} className={classReader({ [`CommonStyle ${styleName}`]: 'tabs__tab' }, actionSet)} id={item?.id}> {/* can overwritten this className style */}
            <span className={classReader({ [`CommonStyle ${styleName}`]: 'focus-helper' })} tabIndex="-1" />

            {/* can overwritten this className style */}
            <a
              className={classReader({ [`CommonStyle ${styleName}`]: 'tabs__tab-content' }, colorSet)}
              data-active={isActive}
              onClick={() => {
                if (isDisabled === false) handleOnTabClick(item.name)
              }}
            >
              <div className={inlineSet}>
                {!!item.icon && (
                  <i className={classReader(
                    `icon icon-${item.icon}`,
                    { 'mr-2': inlineLabel && Boolean(item.label) },
                    { 'mb-2': inlineLabel === false && Boolean(item.label) },
                    { [`icon-${item.iconSize}`]: !!item.iconSize },
                  )}
                  />
                )}

                {Boolean(item.label) && <span>{item.label}</span>}
              </div>
            </a>
            {indicator && (
              <div
                className={classReader(
                  'tabs__tab-content--indicator',
                  `absolute-${indicatorSide}`,
                  `text-${item.activeColor || activeColor || item.tabTextColor || tabTextColor}`,
                )}
                data-active={isActive}
              />
            )}
          </li>
        )
      })}
    </ul >
  )
}

Tabs.propTypes = {
  activeColor: PropTypes.string,
  activeTab: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  activeTextColor: PropTypes.string,
  align: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  indicator: PropTypes.bool,
  inlineLabel: PropTypes.bool,
  onClick: PropTypes.func,
  styleName: PropTypes.string,
  tabColor: PropTypes.string,
  tabData: PropTypes.array,
  tabTextColor: PropTypes.string,
  vertical: PropTypes.bool,
}

export default memo(Tabs)
