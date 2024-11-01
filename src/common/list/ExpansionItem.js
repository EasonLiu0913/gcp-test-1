import React, {
  useState,
  memo,
  useEffect,
} from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'
import Item from 'common/list/Item'
import ItemSection from 'common/list/ItemSection'
// import Separator from 'common/Separator'

const ExpansionItem = ({
  activeColor,
  activeFocused = false,
  activeTextColor,
  buttonCaptionLabel,
  children,
  className,
  color,
  defaultExpanded = false,
  dense = false,
  headerInsetLevel = 0,
  icon,
  iconColor,
  id,
  label,
  textColor,
  topCaptionLabel,
}) => {

  const [isToggle, setIsToggle] = useState(false)

  const handleToggle = () => {
    setIsToggle(prev => !prev)
  }

  const toggleType = isToggle ? 'expanded' : 'collapsed'

  useEffect(() => {
    if (defaultExpanded) {
      setIsToggle(defaultExpanded)
    }
  }, [defaultExpanded])

  return (
    <section
      className={classReader(
        'expansion-item item-type expansion-item--standard',
        `expansion-item--${toggleType}`,
        className,
      )}
      id={id}
    >
      {/* expansion header */}
      <div className={classReader('expansion-item__container relative-position')}>
        <Item
          headerInsetLevel={headerInsetLevel}
          active={isToggle}
          activeFocused={activeFocused}
          color={color}
          textColor={textColor}
          activeColor={activeColor}
          activeTextColor={activeTextColor}
          dense={dense}
          onClick={handleToggle}
          clickable
        >
          {/* header icon */}
          {Boolean(icon) && (
            <ItemSection avatar>
              <i className={
                classReader(`icon icon-${icon} icon-md`,
                  { [`icon-${iconColor}`]: Boolean(iconColor) })}
              />
            </ItemSection>
          )}
          {/* header label */}
          <ItemSection>
            {Boolean(topCaptionLabel) && (
              <div className={classReader('item__label item__label--caption')}>{topCaptionLabel}</div>
            )}

            {Boolean(label) && (
              <div className={classReader('item__label')}>{label}</div>
            )}

            {Boolean(buttonCaptionLabel) && (
              <div className={classReader('item__label item__label--caption')}>{buttonCaptionLabel}</div>
            )}
          </ItemSection>

          {/* toggle icon */}
          <ItemSection className={classReader('focusable relative-position')} side>
            <span className={classReader('icon expansion-item__toggle-icon')} data-active={isToggle}>
              <i className={
                classReader('icon icon-arrow-down icon-md',
                  { [`icon-${activeTextColor}`]: Boolean(activeTextColor) && isToggle })}
              />
            </span>
          </ItemSection>
        </Item>

        {/* expansion content */}
        <div className={
          classReader('expansion-item__content relative-position',
            { 'd-none': isToggle === false })}
        >
          {children}
        </div>

        {/* <Separator className={classReader('expansion-item__border expansion-item__border--top absolute-top')} color="gray-3" /> */}
        {/* <Separator className={classReader('expansion-item__border expansion-item__border--bottom absolute-bottom')} /> */}
      </div>
    </section>
  )
}

ExpansionItem.propTypes = {
  activeColor: PropTypes.string,
  activeFocused: PropTypes.bool,
  activeTextColor: PropTypes.string,
  buttonCaptionLabel: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.string,
  defaultExpanded: PropTypes.bool,
  dense: PropTypes.bool,
  headerInsetLevel: PropTypes.number,
  icon: PropTypes.string,
  iconColor: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.node,
  textColor: PropTypes.string,
  topCaptionLabel: PropTypes.node,
}

export default memo(ExpansionItem)