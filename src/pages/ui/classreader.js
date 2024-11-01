import React, {
  memo, useState, useEffect, 
} from 'react'
import Head from 'next/head'
import Breadcrumbs from 'common/Breadcrumbs'
import classReader from 'utils/classReader'
import { styleList } from 'config/styleList'

const ClassReaderTester = () => {

  const [ dev, setDev ] = useState(false)

  useEffect(() => {
    if (UI_VIEW) setDev(true) 
    else window.location = '/404'
  }, [])

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
      label: 'Class Reader',
      link: '/ui/ui-classReader',
    },
  ]

  const FORMAT_SAMPLE_BASIC = [
    'row align-items-end text-center border',
    'col-12 col-md-6 col-xl-3 pl-0 pr-0',
    'border border-1 my-5 m-auto bg-gray-2 shadow-3',
  ]

  const FORMAT_SAMPLE_ADV = [
    [
      `'container', {indexStyled:['home-section', 'home-section--theme']}
      `,
      classReader('container', { indexStyled: ['home-section', 'home-section--theme'] }),
    ],
    [
      `border border-1 my-5 m-auto {"rotate-45":true} {"SearchStyle":"product-search"}
      `,
      classReader('border border-1 my-5 m-auto {"rotate-45":true} {"SearchStyle":"product-search"}'),
    ],
    [
      ` {SearchStyle:['filter-bar__list']},
          {CommonStyle: [{'disabled {"SearchStyle":["filter-bar--disabled"]}': true}]}
      `,
      classReader({ SearchStyle: ['filter-bar__list'] },
        { CommonStyle: [{ 'disabled {"SearchStyle":["filter-bar--disabled"]}': true }] }),
    ],
  ]

  const FORMAT_SAMPLE_LIST = [
    [
      '純字串',
      '\'row\'',
      classReader('row'),
    ],
    [
      '同名字串，不加前綴字',
      '{pure:\'row\'}',
      classReader({ pure: 'row' }),
    ],
    [
      '引用某支 SCSS style',
      '{KeyVisionStyle:\'title\'}',
      classReader({ KeyVisionStyle: 'title' }),
    ],
    [
      '使用布林值判斷開啟/關閉',
      '{\'d-flex\':true}',
      classReader({ 'd-flex': true }),
    ],
    [
      '引用某支 SCSS style + 布林值開關',
      '{KeyVisionStyle:{title:true}}',
      classReader({ KeyVisionStyle: { title: true } }),
    ],
    [
      '連續字串 classname',
      '\'col-12 col-sm-6\'',
      classReader('col-12 col-sm-6'),
    ],
    [
      '連續字串 classname + 引用某支 SCSS style 多個樣式',
      '\'col-12 col-sm-6 {KeyVisionStyle:["title","_bg"]}\'',
      classReader('col-12 col-sm-6 {KeyVisionStyle:["title","_bg"]}'),
    ],
    [
      '連續字串 classname + 引用某支 SCSS style + 布林值開關',
      '\'col-12 col-sm-6\', {SearchStyle:{\'filter-bar product-search\':false}}',
      classReader('col-12 col-sm-6', { SearchStyle: { 'filter-bar product-search': false } }),
    ],
    [
      '雙重 SCSS Style 判斷',
      '{\'CommonStyle IndexStyled\':\'card\'}',
      classReader( { 'CommonStyle IndexStyled': 'card' }),
    ],
  ]

  return dev && (
    <>
      <Head>
        <title>Class Reader</title>
        <meta name="description" content="ICON" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex,nofollow" />
        <meta name="googlebot" content="noindex,nofollow" />
      </Head>
    
      <main className={classReader('mb-5')}>
        <div className={classReader('container')}>
          <Breadcrumbs options={BREADCRUMB_OPTIONS} />
          <h1>ClassReader example</h1>
          <div
            className={classReader('row align-items-end text-center border')}
          >
            <div
              className={classReader('col-12 col-md-6 col-xl-3 pl-0 pr-0')}
            >
              <div
                className={classReader('border border-1 my-5 m-auto ')}
                style={{
                  width: '100px',
                  height: '100px', 
                }}
              ></div>
              <div className={classReader('bg-gray-2 p-2 text-md')}>
                <span className={classReader('text-primary')}>
                    border border-1
                </span>
              </div>
            </div>
            <div
              className={classReader('col-12 col-md-6 col-xl-3 pl-0 pr-0')}
            >
              <div
                className={classReader('border border-1 my-5 m-auto {"rotate-45":true} {"SearchStyle":"product-search"}')}
                style={{
                  width: '100px',
                  height: '100px', 
                }}
              ></div>
              <div className={classReader('bg-gray-2 p-2 text-md')}>
                <span className={classReader('text-primary')}>
                    border border-1 {'{"rotate-45":true}'}{' '}
                </span>
              </div>
            </div>

            <div
              className={classReader('col-12 col-md-6 col-xl-3 pl-0 pr-0')}
            >
              <div
                className={classReader('border border-1 my-5 m-auto bg-gray-2')}
                style={{
                  width: '100px',
                  height: '100px', 
                }}
              ></div>
              <div className={classReader('bg-gray-2 p-2 text-md')}>
                <span className={classReader('text-primary')}>
                    border border-1 bg-gray-2{' '}
                </span>
              </div>
            </div>

            <div
              className={classReader('col-12 col-md-6 col-xl-3 pl-0 pr-0')}
            >
              <div
                className={classReader('border border-1 my-5 m-auto bg-gray-2 shadow-3')}
                style={{
                  width: '100px',
                  height: '100px', 
                }}
              ></div>
              <div className={classReader('bg-gray-2 p-2 text-md')}>
                <span className={classReader('text-primary')}>
                    border border-1 bg-gray-2 shadow-3{' '}
                </span>
              </div>
            </div>
          </div>

          <hr className={classReader('mt-5 mb-5')} />

          <h2>實際頁面範例</h2>
          <div
            className={classReader('row align-items-center justify-content-start border px-4')}
          >
            <h3 className={classReader('w-100')}>基本款：</h3>
            {FORMAT_SAMPLE_BASIC.map((sample) => {
              return (
                <div
                  key={sample}
                  className={classReader('w-100 border border-1 mb-3')}
                >
                  <p
                    className={classReader('bg-gray-2 m-0 p-3 w-100 mb-3')}
                  >{`className={ classReader( '${sample}' )}`}</p>
                  <p className={classReader('px-3')}>{`=> ${classReader(sample)}`}</p>
                </div>
              )
            })}
            <h3 className={classReader('w-100')}>進階款：</h3>
            {FORMAT_SAMPLE_ADV.map((sample) => {
              return (
                <div
                  key={sample}
                  className={classReader('w-100 border border-1 mb-3')}
                >
                  <p
                    className={classReader('bg-gray-2 m-0 p-3 w-100 mb-3')}
                  >{`className={ classReader( ${sample[0]} )}`}</p>
                  <p className={classReader('px-3')}>{`=>${sample[1]}`}</p>
                </div>
              )
            })}
          </div>

          <hr className={classReader('mt-5 mb-5')} />

          <h2>基本格式規則範例</h2>
          <div
            className={classReader('row align-items-center justify-content-start border px-4')}
          >
            {FORMAT_SAMPLE_LIST.map((sample) => {
              return (
                <div key={sample} className={classReader('w-100')} >
                  <h3 className={classReader('w-100')}>{sample[0]}：</h3>
                  <div className={classReader('w-100 border border-1 mb-3')}>
                    <p
                      className={classReader('bg-gray-2 m-0 p-3 w-100 mb-3')}
                    >{`className={ classReader( ${sample[1]} )}`}</p>
                    <p className={classReader('px-3')}>{`=>${sample[2]}`}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>

    </>
  )
}

export default memo(ClassReaderTester)
