import React, { memo } from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'
import { selectUser } from 'slices/userSlice'
import { useSelector } from 'react-redux'

const Header = ({
  className,
  id,
  onMenuPopup = () => {},
  onUserPopup = () => {},
}) => {

  const user = useSelector(selectUser)
 
  return <>
    <header id={id} className={classReader('header bg-white public-padding', className)}>
      <div className={classReader('row align-items-center h-100 justify-content-between')}>
        <div className={classReader('d-flex d-xl-none align-items-center')}>
          <i className={classReader('icon icon-menu cursor-pointer')} onClick={onMenuPopup}/>
        </div>
        <div className={classReader('header__project text-secondary h5 ellipsis')}>{user.defaultProjectName}</div>
        <span className={classReader('header__user d-flex  align-items-center justify-content-center bg-gray-5 rounded-100 cursor-pointer w-2')}>
          <i className={classReader('icon icon-user-full icon-white')} onClick={onUserPopup}/>
        </span>
      </div>
    </header>
  </>
}

Header.propTypes = { 
  className: PropTypes.string,
  id: PropTypes.string,
  onMenuPopup: PropTypes.func, 
  onUserPopup: PropTypes.func,
}

export default memo(Header)