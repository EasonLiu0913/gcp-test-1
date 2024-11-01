import React, { memo } from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'
import Link from 'next/link'
import Image from 'next/image'
const LoginLayoutPanel = ({
  children,
  className,
  id,
  linkLabel = '',
  linkPath = '',
  subTitle = '',
  title = '',  
}) => {

  return (
    <main className={classReader(
      className,
      'row',
      { LoginStyle: 'main' },
    )}
    id={id}
    >
      <div className={classReader({ LoginStyle: 'main__animate-bg' }, 'd-none d-md-flex justify-content-center align-items-center col-12 col-md-6')}>
        {/* 因 console 報錯警告 fetchPriority，故此處不使用 nextJS Image */}
        {/* <Image src="/login/login-main-img.svg" alt="" width={368} height={380} priority /> */}
        <img src="/straight-logo.svg" width={368} height={380} alt="" className={classReader('mr-2')} />
      </div>
        
      <div className={classReader('col-12 col-md-6 bg-white')}>
        <div className={classReader('scrollbar-y h-100 d-flex justify-content-center align-items-center')}>
          <div className={classReader({ LoginStyle: 'main__login' }, 'm-auto p-4')}>
            <div className={classReader('my-5')}>
              <div className={classReader('pb-2 pb-sm-3 text-center d-md-none')}>
                <img 
                  src="/logo.svg"
                  width={200}
                  height={70}
                  alt="logo"
                  className={classReader({ LoginStyle: 'main__login__logo' })}
                />
              </div>
              <h1 className={classReader('text-h3 text-sm-h2 m-0')}>{title}</h1>
              <p className={classReader({ LoginStyle: 'main__login__subtitle' })}>{subTitle}</p>
            </div>
            {children}

            {linkLabel &&
              <p className={classReader('d-flex align-items-center pt-2')}>
                <Link
                  className={classReader('primary m-auto')}
                  prefetch={false}
                  href={linkPath}
                  aria-label={linkLabel}
                  passHref
                >
                  {linkLabel}
                </Link>
              </p>
            }
          </div>
        </div>

      </div>
    </main>
  )
}

LoginLayoutPanel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
  linkLabel: PropTypes.string,
  linkPath: PropTypes.string,
  subTitle: PropTypes.string,
  title: PropTypes.string,  
}

export default memo(LoginLayoutPanel)
