import React, {
  useState,
  useEffect,
} from 'react'
import Cookies from 'js-cookie'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import classReader from 'utils/classReader'
import Header from 'common/layout/Header'
import Menu from 'common/layout/Menu'
import UserInfo from 'common/layout/UserInfo'
import Footer from 'common/layout/Footer'
import Popup from 'common/layout/popup/Popup'
import { OAUTH } from 'config/config'
import { NAV_DATA } from 'config/layout'

const Layout = ({ children }) => {

  const router = useRouter()

  const [login, setLogin] = useState(false)
  const [mobileMenuPrompt, setMobileMenuPrompt] = useState(false)
  const [mobileUserPrompt, setMobileUserPrompt] = useState(false)
  const layoutHidden = mobileMenuPrompt || mobileUserPrompt

  useEffect(() => {
  }, [mobileMenuPrompt])

  useEffect(() => {
    setMobileMenuPrompt(false)
    setMobileUserPrompt(false)
  }, [router.push])

  useEffect(() => {
    const jwt = Cookies.get(OAUTH.TOKEN)
    setLogin(Boolean(jwt))
  }, [])
  
  {/* 避免未登入時，進入網站，在未跳轉至 login 前，出現非必要版塊、選項 */}
  return login ? <>
    <div data-hidden={layoutHidden} className={classReader('layout')}>
      <div className={classReader('d-flex flex-row')}>

        <nav className={classReader('left-menu')}>
          <Menu />
        </nav>
        <Header 
          onMenuPopup={() => setMobileMenuPrompt(prev => !prev)}
          onUserPopup={() => setMobileUserPrompt(prev => !prev)}
        />
        <div className={classReader('layout__body flex-column justify-content-between w-100')}>
          <div className={classReader('layout__content public-padding')}>
            {children}
          </div>
          <Footer />
        </div>
      </div>
    
    </div>
  
    <Popup 
      className="d-xl-none"
      prompt={mobileMenuPrompt}
      onClosePopup={() => setMobileMenuPrompt(false)}
      fadeIn
      full
      slideIn="left"
      align="left"
    >
      <Menu />
    </Popup>
    
    <Popup 
      prompt={mobileUserPrompt}
      onClosePopup={() => setMobileUserPrompt(false)}
      slideIn="right"
      align="right-top"
      fadeIn
      headerClass="d-xl-none"
    >
      <UserInfo
        navOption={NAV_DATA}
      />
    </Popup>

  </> : children
}

Layout.propTypes = { children: PropTypes.node }
export default Layout