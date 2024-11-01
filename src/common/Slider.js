import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  memo,
} from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'
import { Swiper, SwiperSlide } from 'swiper/react'
import {
  Pagination,
  Navigation,
  EffectCoverflow,
  EffectCreative,
} from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-coverflow'

const Slider = ({
  autoWidth = false,
  breakpoints = {},
  buttonOutside = false,
  centeredSlides = false,
  className,
  coverflowEffect = {},
  creativeEffect = {},
  customLeftNavigation = (prevFunc) => { },
  customRightNavigation = (prevFunc) => { },
  effect,
  extendedWidth = false,
  id,
  initialSlide = 0,
  isSlideReset = false,
  loop = false,
  navigation = false,
  pagination = false,
  slides = [],
  slidesPerGroup = 1,
  slidesPerView = 1,
  spaceBetween = 0,
  styleName,
  swiperClassName = '',
}) => {

  const [prevSliderHide, setPrevSliderHide] = useState(false)
  const [nextSliderHide, setNextSliderHide] = useState(false)
  const [mouseEnterId, setMouseEnterId] = useState('slider0')
  const sliderRef = useRef(null)

  const widthAttr = (slideId) => {
    let attr = {}

    if (extendedWidth) {
      attr = {
        className: classReader('swiper-slide--extended-width'),
        'data-active': mouseEnterId === slideId,
        onMouseEnter: () => {
          if (mouseEnterId !== slideId) setMouseEnterId(slideId)
        },
      }
    } else if (autoWidth) {
      attr = { className: classReader('swiper-slide--auto-width') }
    }

    return attr
  }

  const handleButtonVisible = useCallback(() => {
    setPrevSliderHide(sliderRef?.current?.swiper?.isBeginning ?? true)
    setNextSliderHide(sliderRef?.current?.swiper?.isEnd ?? true)
  }, [])

  const handlePrev = useCallback(() => {
    if (sliderRef.current === null) return
    sliderRef.current.swiper.slidePrev()
    handleButtonVisible()
  }, [handleButtonVisible])

  const handleNext = useCallback(() => {
    if (sliderRef.current === null) return
    sliderRef.current.swiper.slideNext()
    handleButtonVisible()
  }, [handleButtonVisible])

  useEffect(() => {
    if (slides.length && isSlideReset) sliderRef?.current?.swiper.slideTo(0, 1)
  }, [slides])

  useEffect(() => {
    handleButtonVisible()
  }, [handleButtonVisible])

  return (
    <section className={classReader('slider', className)}>

      {customLeftNavigation(handlePrev) !== void 0 && (
        <div className={
          classReader(
            { [`CommonStyle ${styleName}`]: 'swiper__prepend' }, // can overwritten this className style
            { 'swiper__prepend--outside': buttonOutside },
            { 'swiper--disabled': prevSliderHide && loop === false },
          )}
        >
          {customLeftNavigation(handlePrev)}
        </div>
      )}

      <Swiper
        ref={sliderRef}
        id={id}
        initialSlide={initialSlide}
        className={swiperClassName}
        slidesPerView={slidesPerView} // total number of slides must be >= slidesPerView * 2
        slidesPerGroup={slidesPerGroup}
        spaceBetween={spaceBetween}
        breakpoints={breakpoints}
        modules={[
          Pagination,
          Navigation,
          EffectCoverflow,
          EffectCreative,
        ]}
        onSlideChange={handleButtonVisible}
        speed={450}
        pagination={pagination && { clickable: true }}
        navigation={navigation}
        loop={loop}
        centeredSlides={centeredSlides}
        effect={effect}
        coverflowEffect={coverflowEffect}
        creativeEffect={creativeEffect}
        roundLengths
        watchOverflow
      >
        {slides?.map(slide => (
          <SwiperSlide key={slide.id} {...widthAttr(slide.id)}>
            {slide.content}
          </SwiperSlide>
        ))}
      </Swiper>
      
      {customRightNavigation(handleNext) !== void 0 && (
        <div className={
          classReader(
            { [`CommonStyle ${styleName}`]: 'swiper__append' }, // can overwritten this className style
            { 'swiper__append--outside': buttonOutside },
            { 'swiper--disabled': nextSliderHide && loop === false },
          )}
        >
          {customRightNavigation(handleNext)}
        </div>
      )}
    </section>
  )
}

Slider.propTypes = {
  autoWidth: PropTypes.bool,
  breakpoints: PropTypes.object,
  buttonOutside: PropTypes.bool,
  centeredSlides: PropTypes.bool,
  className: PropTypes.string,
  coverflowEffect: PropTypes.object,
  creativeEffect: PropTypes.object,
  customLeftNavigation: PropTypes.func,
  customRightNavigation: PropTypes.func,
  effect: PropTypes.string,
  extendedWidth: PropTypes.bool,
  id: PropTypes.string,
  initialSlide: PropTypes.number,
  isSlideReset: PropTypes.bool,
  loop: PropTypes.bool,
  navigation: PropTypes.bool,
  pagination: PropTypes.bool,
  slides: PropTypes.array,
  slidesPerGroup: PropTypes.number,
  slidesPerView: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  spaceBetween: PropTypes.number,
  styleName: PropTypes.string,
  swiperClassName: PropTypes.string,
}

export default memo(Slider)