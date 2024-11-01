import React, {
  memo, useState, useEffect,
} from 'react'
import Head from 'next/head'
import classReader from 'utils/classReader'
import Breadcrumbs from 'common/Breadcrumbs'
import { UI_VIEW } from 'config/config'

const BREADCRUMB_OPTIONS = [
  {
    label: '首頁',
    icon: 'home',
    color: 'teal',
    link: '/',
  },
  {
    label: 'UI',
    link: '/ui',
  },
  {
    label: 'ICON',
    link: '/ui/icon',
  },
]

const ICON_GOOGLE = [
  'arrow-down',
  'arrow-left',
  'arrow-right',
  'arrow-up',
  'triangle-down',
  'triangle-left',
  'triangle-right',
  'triangle-up',
  'help-full',
  'info-full',
  'error',
  'check-circle',
  'cancel',
  'add',
  'remove',
  'done',
  'close',
  'refresh',
  'sync',
  'eye',
  'eye-off',
  'settings',
  'edit-border',
  'edit',
  'delete-cross',
  'star',
  'favorite',
  'favorite-full',
  'search',
  'home',
  'logout',
  'download',
  'upload',
  'fullscreen',
  'add-comment',
  'sms-failed',
  'menu',
  'sort',
  'filter',
  'calendar',
  'event-note',
  'schedule',
  'shopping-cart',
  'add-shopping-cart',
  'card',
  'card-add',
  'card-check',
  'money',
  'user',
  'user-full',
  'location',
  'email',
  'phone',
  'minimize',
  'arrow-forward',
  'account-balance',
  'currency-exchange',
]

const ICON_GOOGLE_MENU = [
  'dashboard',
  'group',
  'manage-accounts',
  'fact-check',
  'receipt-long',
  'point-of-sale',
]

const ICON_LOGO = [
  'cut-chicTrip',
  'chicTrip',
  'cut-hotaigo',
  'hotaigo',
]

const ICON_ORDER = [
  'point',
  'stroke-money',
  'point icon-white bg-red rounded-100',
  'stroke-money icon-white bg-secondary rounded-100',
  'point icon-sm icon-white bg-red rounded-100',
  'stroke-money icon-sm icon-white bg-secondary rounded-100',
  'goto',
]

const ICON_CARD = [
  'jcb',
  'visa',
  'mc',
  'up',
]

const ICON_ROTATE = [
  315,
  0,
  45,
  270,
  0,
  90,
  225,
  180,
  135,
]

const Icon = () => {

  const [dev, setDev] = useState(false)

  useEffect(() => {
    if (UI_VIEW) setDev(true) 
    else window.location = '/404'
  }, [])

  return dev && (
    <>
      <Head>
        <title>ICON</title>
        <meta name="description" content="ICON" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex,nofollow" />
        <meta name="googlebot" content="noindex,nofollow" />
      </Head>
      <main className={classReader('mb-5')}>
        <div className={classReader('container')}>
          <Breadcrumbs options={BREADCRUMB_OPTIONS} />
          <h1>ICON Size</h1>
          <div className={classReader('row align-items-end text-center')}>
            <div className={classReader('col-12 col-md-6 col-xl-3 pl-0 pr-0')}>
              <div className={classReader('border')}>
                <i className={classReader('icon icon-user icon-sm mt-3 mb-3')} />
                <div className={classReader('bg-gray-2 p-2 text-md')}>
                  <span className={classReader('text-primary')}>icon-sm</span>
                </div>
              </div>
            </div>
            <div className={classReader('col-12 col-md-6 col-xl-3 pl-0 pr-0')}>
              <div className={classReader('border')}>
                <i className={classReader('icon icon-user icon-md mt-3 mb-3')} />
                <div className={classReader('bg-gray-2 p-2 text-md')}>
                  <span className={classReader('text-primary')}>預設大小(可不填) / icon-md</span>
                </div>
              </div>
            </div>
            <div className={classReader('col-12 col-md-6 col-xl-3 pl-0 pr-0')}>
              <div className={classReader('border')}>
                <i className={classReader('icon icon-user icon-lg mt-3 mb-3')} />
                <div className={classReader('bg-gray-2 p-2 text-md')}>
                  <span className={classReader('text-primary')}>icon-lg</span>
                </div>
              </div>
            </div>
            <div className={classReader('col-12 col-md-6 col-xl-3 pl-0 pr-0')}>
              <div className={classReader('border')}>
                <i className={classReader('icon icon-user icon-xl mt-3 mb-3')} />
                <div className={classReader('bg-gray-2 p-2 text-md')}>
                  <span className={classReader('text-primary')}>icon-xl</span>
                </div>
              </div>
            </div>
          </div>

          <hr className={classReader('mt-5 mb-5')} />

          <h1>ICON Rotate</h1>
          <div className={classReader('row align-items-end text-center')}>
            {ICON_ROTATE.map((item, index) => <>
              <div key={index} className={classReader('col-12 col-sm-6 col-xl-4 text-center pl-0 pr-0')}>
                <div className={classReader('border')}>
                  <i className={classReader(`icon icon-user ${`rotate-${item}`} icon-lg mt-3 mb-3`)} />
                  <div className={classReader('bg-gray-2 p-2 text-md')}>
                    <span>{'<'}</span><span className={classReader('text-red')}>i</span> <span className={classReader('text-indigo')}>class</span>=<span className={classReader('text-primary')}>{`"icon icon-user ${index > 0 ? `rotate-${item}` : ''}"`}</span> <span>{'/>'}</span>
                  </div>
                </div>
              </div>
            </>)}

          </div>

          <hr className={classReader('mt-5 mb-5')} />

          <h1>LOGO</h1>
          <div className={classReader('row align-items-end')}>
            {ICON_LOGO.map((item, index) =>
              <div key={index} className={classReader('col-12 col-sm-6 text-center pl-0 pr-0')}>
                <div className={classReader('border')}>
                  <i className={classReader(`icon icon-${item} mt-3 mb-3`)} />
                  <div className={classReader('bg-gray-2 p-2 text-md')}>
                    <span>{'<'}</span><span className={classReader('text-red')}>i</span> <span className={classReader('text-indigo')}>class</span>=<span className={classReader('text-primary')}>{`"icon icon-${item}"`}</span> <span>{'/>'}</span>
                  </div>
                </div>
              </div>)}
          </div>

          <hr className={classReader('mt-5 mb-5')} />

          <h1>Other</h1>
          <div className={classReader('row align-items-end')}>
            {ICON_ORDER.map((item, index) =>
              <div key={index} className={classReader('col-12 col-sm-6 text-center pl-0 pr-0')}>
                <div className={classReader('border')}>
                  <i className={classReader(`icon icon-${item} mt-3 mb-3`)} />
                  <div className={classReader('bg-gray-2 p-2 text-md')}>
                    <span>{'<'}</span><span className={classReader('text-red')}>i</span> <span className={classReader('text-indigo')}>class</span>=<span className={classReader('text-primary')}>{`"icon icon-${item}"`}</span> <span>{'/>'}</span>
                  </div>
                </div>
              </div>)}
          </div>

          <hr className={classReader('mt-5 mb-5')} />

          <h1>Credit Card</h1>
          <div className={classReader('row align-items-end')}>
            {ICON_CARD.map((item, index) =>
              <div key={index} className={classReader('col-12 col-sm-6 col-xl-3 text-center pl-0 pr-0')}>
                <div className={classReader('border')}>
                  <i className={classReader(`icon icon-cc icon-${item} icon-xl mt-3 mb-3`)} />
                  <div className={classReader('bg-gray-2 p-2 text-md')}>
                    <span>{'<'}</span><span className={classReader('text-red')}>i</span> <span className={classReader('text-indigo')}>class</span>=<span className={classReader('text-primary')}>{`"icon icon-cc icon-${item}"`}</span> <span>{'/>'}</span>
                  </div>
                </div>
              </div>)}
          </div>

          <hr className={classReader('mt-5 mb-5')} />

          <h1>Google ICON</h1>
          <div className={classReader('row')}>
            {ICON_GOOGLE.map((item, index) =>
              <div key={index} className={classReader('col-12 col-sm-6 col-xl-3 text-center pl-0 pr-0')}>
                <div className={classReader('border')}>
                  <i className={classReader(`icon icon-${item} icon-lg mt-3 mb-3`)} />
                  <div className={classReader('bg-gray-2 p-2 text-md')}>
                    <span>{'<'}</span><span className={classReader('text-red')}>i</span> <span className={classReader('text-indigo')}>class</span>=<span className={classReader('text-primary')}>{`"icon icon-${item}"`}</span> <span>{'/>'}</span>
                  </div>
                </div>
              </div>)}
          </div>

          <hr className={classReader('mt-5 mb-5')} />
          
          <h1>Google ICON - Menu</h1>
          <div className={classReader('')}>
            {ICON_GOOGLE_MENU.map((item, index) =>
              <div key={index} className={classReader('col-12 col-md-6 col-xl-3 text-center pl-0 pr-0')}>
                <div className={classReader('border')}>
                  <i className={classReader(`icon icon-${item} icon-lg mt-3 mb-3`)} />
                  <div className={classReader('bg-gray-2 p-2 text-md')}>
                    <span>{'<'}</span><span className={classReader('text-red')}>i</span> <span className={classReader('text-indigo')}>class</span>=<span className={classReader('text-primary')}>{`"icon icon-${item}"`}</span> <span>{'/>'}</span>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </main>
    </>
  )
}

export default memo(Icon)