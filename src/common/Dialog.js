import React, {
  useState,
  useEffect,
  memo,
} from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'

const Dialog = ({
  children,
  className,
  onClose = () => {},
  persistent = false,
  prompt = false,
}) => {

  const [animeControl, setAnimeControl] = useState(false)

  const handleBackdropClose = (e) => {
    if (persistent) return

    const targetClass = e?.target?.className
    const isClose = typeof targetClass === 'string' && targetClass.includes('backdrop')

    if (isClose) onClose(false)
  }

  useEffect(() => {
    const body = window.document.body

    if (prompt) {
      // 這個造成如果畫面本來有overflow，然後開啟dialog 又沒有overflow，然後整個畫面就會跳動
      // body.classList.add(classReader('overflow-hidden'))
      setAnimeControl(true)
    } else {
      // 下面這個setTimeout 的用法
      // 假設 我在一個頁面 useState(false)
      // 然後在useEffect 在小於200ms 的時間又setState(true) 的話，會有問題
      // setTimeout(() => setAnimeControl(false), 200)
      setAnimeControl(false)
    }

    // return () => {
    //   body.classList.remove(classReader('overflow-hidden'))
    // }
  }, [prompt])

  const dialogStatus = prompt ? 'open' : 'close'
  return (
    animeControl && (
      <section className={classReader(
        'backdrop fullscreen', `backdrop--${dialogStatus}`, className,
      )}>
        <div
          className={classReader('backdrop__content fixed-full d-flex flex-center')}
          onClick={handleBackdropClose}
        >
          {children}
        </div>
      </section>
    )
  )
}

Dialog.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onClose: PropTypes.func,
  persistent: PropTypes.bool,
  prompt: PropTypes.bool,
}

export default memo(Dialog)
