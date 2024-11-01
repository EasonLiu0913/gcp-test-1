import { useEffect, useState } from 'react'
import { debounce } from 'lodash'

export const useWindowSize = () => {
  const [windowWidthSize, setWindowWidthSize] = useState(0)
  const [windowHeightSize, setWindowHeightSize] = useState(0)
  const [isWindowWidthLgMax, setIsWindowWidthLgMax] = useState(false)
  const [isWindowWidthMdMax, setIsWindowWidthMdMax] = useState(false)
  const [isWindowWidthSmMax, setIsWindowWidthSmMax] = useState(false)

  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowWidthSize(window.innerWidth)
      setWindowHeightSize(window.innerHeight)
    }, 100)

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (windowWidthSize === 0) return

    if (windowWidthSize < 992) {
      setIsWindowWidthLgMax(true)
    } else {
      setIsWindowWidthLgMax(false)
    }

    if (windowWidthSize < 768) {
      setIsWindowWidthMdMax(true)
    } else {
      setIsWindowWidthMdMax(false)
    }

    if (windowWidthSize < 576) {
      setIsWindowWidthSmMax(true)
    } else {
      setIsWindowWidthSmMax(false)
    }
  }, [windowWidthSize])

  return {
    windowWidthSize,
    windowHeightSize,
    isWindowWidthLgMax,
    isWindowWidthMdMax,
    isWindowWidthSmMax,
  }
}
