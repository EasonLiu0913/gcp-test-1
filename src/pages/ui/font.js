import React, {
  memo,
  useState,
  useEffect,
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
    label: 'Font Size',
    link: '/ui/font',
  },
]

const HEADING = [
  {
    key: 1,
    value: '36px', 
  },
  {
    key: 2,
    value: '30px', 
  },
  {
    key: 3,
    value: '24px', 
  },
  {
    key: 4,
    value: '18px', 
  },
  {
    key: 5,
    value: '16px', 
  },
  {
    key: 6,
    value: '14px', 
  },
]

const TEXTSIZE = [
  {
    key: 'xl',
    value: '24px',
  },
  {
    key: 'lg',
    value: '20px',
  },
  {
    key: 'md',
    value: '14px',
  },
  {
    key: 'sm',
    value: '12px',
  },
  {
    key: 'xs',
    value: '10px',
  },
]

const Font = () => {

  const [ dev, setDev ] = useState(false)

  useEffect(() => {
    if (UI_VIEW) setDev(true) 
    else window.location = '/404'
  }, [])

  return dev && (
    <>
      <Head>
        <title>Font Size</title>
        <meta name="description" content="Font Size" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex,nofollow" />
        <meta name="googlebot" content="noindex,nofollow" />
      </Head>
      
      <main className={classReader('mb-5')}>
        <div className={classReader('container')}>
          <Breadcrumbs options={BREADCRUMB_OPTIONS} />
          <h1>Font Size</h1>

          <hr className={classReader('mt-5 mb-5')} />

          <section>
            <h2>H1 ~ H6</h2>
            <div className={classReader('p-3 border')}>
              { HEADING.map( (item, index) => 
                <div key={index} className={classReader(`h${item.key} mb-3`)}>H{item.key}. EC heading, {item.value}</div>)}
            </div>
            <div className={classReader('bg-gray-2 p-3')}>
              { HEADING.map( (item, index) => 
                <div key={index} className={classReader('mb-3')}>
                  <span>{'<'}</span><span className={classReader('text-red')}>p</span> <span className={classReader('text-indigo')}>class</span>=<span className={classReader('text-primary')}>{`"h${item.key}"`}</span><span>{'>'}</span>H{item.key}. EC heading, {item.value}<span>{'<'}</span><span className={classReader('text-red')}>p</span><span>{'/>'}</span>
                </div>)}
            </div>
          </section>

          <hr className={classReader('mt-5 mb-5')} />

          <section>
            <h2>Text Size</h2>
            <div className={classReader('p-3 border')}>
              { TEXTSIZE.map( (item, index) => 
                <div key={index} className={classReader(`text-${item.key} mb-3`)}>text-{item.key}, {item.value}</div>)}
            </div>
            <div className={classReader('bg-gray-2 p-3')}>
              { TEXTSIZE.map( (item, index) => 
                <div key={index} className={classReader('mb-3')}>
                  <span>{'<'}</span><span className={classReader('text-red')}>p</span> <span className={classReader('text-indigo')}>class</span>=<span className={classReader('text-primary')}>{`"text-${item.key}"`}</span><span>{'>'}</span>text-{item.key}, {item.value}<span>{'<'}</span><span className={classReader('text-red')}>p</span><span>{'/>'}</span>
                </div>)}
            </div>
          </section>
                
        </div>    
      </main>
   
    </>
  )
}

export default memo(Font)