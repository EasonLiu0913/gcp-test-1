import React, { memo } from 'react'
import classReader from 'utils/classReader'

const Footer = () => {
  const data = new Date()

  return (
    <footer className={classReader('footer bg-gray-3 mt-5')}>
      <div className={classReader('footer__copyright text-center gray-6')}>
        <div className={classReader('container')}>Copyright © {data.getFullYear()} Hotai Connected Co.,Ltd Powered by Hotai Motor Corporation</div>
      </div>
    </footer>
  )
}

export default memo(Footer)