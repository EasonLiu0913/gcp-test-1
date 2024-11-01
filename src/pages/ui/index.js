import React, {
  memo,
  useState,
  useEffect, 
} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Breadcrumbs from 'common/Breadcrumbs'
import classReader from 'utils/classReader'
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
]

const UI_LINK = [
  {
    name: 'ICON',
    link: '/ui/icon',
  },
  {
    name: 'Font Size',
    link: '/ui/font',
  },
  {
    name: 'UI Component',
    link: '/ui/ui-view',
  },
  {
    name: 'UI Colors',
    link: '/ui/ui-colors',
  },
  {
    name: 'Class Reader',
    link: '/ui/classreader',
  },
  {
    name: 'Project Redefine UI',
    link: '/ui/summary',
  },
  {
    name: 'URL TITLE Demo',
    link: '/ui/url-title',
  },
]

const Demo = () => {

  const [ dev, setDev ] = useState(false)

  useEffect(() => {
    if (UI_VIEW) setDev(true) 
    else window.location = '/404'
  }, [])

  return (
    <>
      <Head>
        <title>UI</title>
        <meta name="description" content="UI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex,nofollow" />
        <meta name="googlebot" content="noindex,nofollow" />
      </Head>

      {
        dev && <main className={classReader('container')}>
          <Breadcrumbs options={BREADCRUMB_OPTIONS} />
          <h1>UI</h1>
          <section className={classReader('row text-center')}>
            { UI_LINK.map( (item, index) => (
              <div key={index} className={classReader('col-12 col-sm-6 col-lg-4 col-xxl-2')}>
                <div className={classReader('border')}>
                  <Link href={item.link} target="_self" passHref>
                    <h3>{item.name}</h3>
                  </Link>
                </div>
              </div>
            ))}
          </section>
        </main>
      }
    </>
  )
}

export default memo(Demo)