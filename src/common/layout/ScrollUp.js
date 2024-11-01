import React, { useState, useEffect } from 'react'
import classReader from 'utils/classReader'

export const goToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const ScrollUp = () => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShow(true)
      } else {
        setShow(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div
      className={classReader('scroll-up-arrow', { 'scroll-up-arrow--hide': show === false })}
      onClick={goToTop}
    >
      <i className={classReader('icon icon-goto')} />
    </div>
  )
}

export default ScrollUp