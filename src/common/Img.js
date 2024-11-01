import React, { memo } from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'
import Image from 'next/image'
import { handleRatioStyle } from 'utils/util'

const Img = ({
  alt,
  bottomBackdrop = false,
  bottomContent,
  bottomLeftBackdrop = false,
  bottomLeftContent,
  bottomRightBackdrop = false,
  bottomRightContent,
  children,
  className,
  defaultBg = false,
  height,
  id,
  leftBackdrop,
  leftContent,
  priority = false,
  ratio,
  ratioClassName,
  rightBackdrop,
  rightContent,
  src,
  styleName = '',
  topBackdrop = false,
  topContent,
  topLeftBackdrop = false,
  topLeftContent,
  topRightBackdrop = false,
  topRightContent,
  width,
}) => {

  return (
    <section className={classReader('img', className)} id={id}>
      <div className={classReader({ [`CommonStyle ${styleName}`]: 'img__container' }, { 'img__container--bg': defaultBg })}> {/* can overwritten this className style */}
        {Number(ratio) > -1 && (
          <div
            className={classReader('img__aspect-ratio', { [ratioClassName]: Boolean(ratioClassName) })}
            style={Boolean(ratio) ? handleRatioStyle(ratio) : { display: 'block' }}
          />
        )}

        {/* <Image
          className={classReader(
            'img__image',
            { 'img__image--width-full': Boolean(width) === false },
            { 'img__image--height-full': Boolean(height) === false },
            { 'absolute-full': Boolean(ratio) },
            { 'invisible': Boolean(src) === false },
          )}
          src={src || NoPicture}
          alt={alt}
          width={width || 100}
          height={height || 100}
          priority={priority}
        /> */}
      </div>

      <div className={classReader('img__content absolute-full')}>
        {/* top bottom right left */}
        {Boolean(topContent) && (
          <div className={classReader('absolute-top', { 'img--backdrop': topBackdrop })}>
            {topContent}
          </div>
        )}

        {Boolean(bottomContent) && (
          <div className={classReader('absolute-bottom', { 'img--backdrop': bottomBackdrop })}>
            {bottomContent}
          </div>
        )}

        {Boolean(leftContent) && (
          <div className={classReader('absolute-left', { 'img--backdrop': leftBackdrop })}>
            {leftContent}
          </div>
        )}

        {Boolean(rightContent) && (
          <div className={classReader('absolute-right', { 'img--backdrop': rightBackdrop })}>
            {rightContent}
          </div>
        )}

        {/* top-left top-right */}
        {Boolean(topLeftContent) && (
          <div className={classReader('absolute-top-left', { 'img--backdrop': topLeftBackdrop })}>
            {topLeftContent}
          </div>
        )}

        {Boolean(topRightContent) && (
          <div className={classReader('absolute-top-right', { 'img--backdrop': topRightBackdrop })}>
            {topRightContent}
          </div>
        )}

        {/* bottom-left bottom-right */}
        {Boolean(bottomLeftContent) && (
          <div className={classReader('absolute-bottom-left', { 'img--backdrop': bottomLeftBackdrop })}>
            {bottomLeftContent}
          </div>
        )}

        {Boolean(bottomRightContent) && (
          <div className={classReader('absolute-bottom-right', { 'img--backdrop': bottomRightBackdrop })}>
            {bottomRightContent}
          </div>
        )}

        {children}
      </div>
    </section>
  )
}

Img.propTypes = {
  alt: PropTypes.string,
  bottomBackdrop: PropTypes.bool,
  bottomContent: PropTypes.node,
  bottomLeftBackdrop: PropTypes.bool,
  bottomLeftContent: PropTypes.node,
  bottomRightBackdrop: PropTypes.bool,
  bottomRightContent: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  defaultBg: PropTypes.bool,
  height: PropTypes.number,
  id: PropTypes.string,
  leftBackdrop: PropTypes.bool,
  leftContent: PropTypes.node,
  priority: PropTypes.bool,
  ratio: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ratioClassName: PropTypes.string,
  rightBackdrop: PropTypes.bool,
  rightContent: PropTypes.node,
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  styleName: PropTypes.string,
  topBackdrop: PropTypes.bool,
  topContent: PropTypes.node,
  topLeftBackdrop: PropTypes.bool,
  topLeftContent: PropTypes.node,
  topRightBackdrop: PropTypes.bool,
  topRightContent: PropTypes.node,
  width: PropTypes.number,
}

export default memo(Img)