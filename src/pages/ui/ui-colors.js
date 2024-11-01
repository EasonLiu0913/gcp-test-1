import React, {
  memo,
  useState,
  useEffect, 
} from 'react'

import classReader from 'utils/classReader'
import Breadcrumbs from 'common/Breadcrumbs'
import { UI_VIEW } from 'config/config'

const BREADCRUMB = [
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
    label: 'UI Colors',
    link: '/ui/ui-colors',
  },
]

const ALL_COLORS_INFORMATION = [
  {
    title: '主要顏色',
    colorInfo: [
      {
        label: '企業主要色',
        value: 'primary',
        code: '#00AEDC',
      },
      {
        label: '企業輔色',
        value: 'secondary',
        code: '#FFB300',
      },
      {
        label: '重點色',
        value: 'red',
        code: '#EC3929',
      },
    ],
  }, 
  {
    title: '主要淺色',
    colorInfo: [
      {
        label: 'Light Primary',
        value: 'light-primary',
        code: '#e1f0ff',
      },
      {
        label: 'Light Orange',
        value: 'light-orange',
        code: '#ffedea',
      },
      {
        label: 'Light Teal',
        value: 'light-teal',
        code: '#dff2f4',
      },
    ],
  }, 
  {
    title: 'Body色系',
    colorInfo: [ 
      {
        label: 'Body 內容',
        value: 'gray-9',
        code: '#404040',
      },
      {
        label: 'Body 背景色',
        value: 'white',
        code: '#ffffff',
      },
    ],
  },
  {
    title: '預設顏色',
    colorInfo: [
      {
        label: 'white',
        value: 'white',
        code: '#ffffff',
      },
      {
        label: 'gray',
        value: 'gray',
        code: '#8e8e8e',
      },
      {
        label: 'black',
        value: 'black',
        code: '#000000',
      },
    ],
  },
  {
    title: '其他色系',
    colorInfo: [
      {
        label: 'orange',
        value: 'orange',
        code: '#f37552',
      },
      {
        label: 'blue',
        value: 'blue',
        code: '#3d78e3',
      },
      {
        label: 'indigo',
        value: 'indigo',
        code: '#5b71b9',
      },
      {
        label: 'purple',
        value: 'purple',
        code: '#6559cc',
      },
      {
        label: 'pink',
        value: 'pink',
        code: '#f672a7',
      },
      {
        label: 'green',
        value: 'green',
        code: '#67b173',
      },
      {
        label: 'teal',
        value: 'teal',
        code: '#02a8b5',
      },
    ],
  },
  {
    title: '灰色系',
    colorInfo: [
      {
        label: 'gray-1',
        value: 'gray-1',
        code: '#f4f4f4',
        textColor: 'black',
        note: '淡灰底 or 底線',
      },
      {
        label: 'gray-2',
        value: 'gray-2',
        code: '#ededed',
        textColor: 'black',
        note: '淡灰底 or 底線',
      },
      {
        label: 'gray-3',
        value: 'gray-3',
        code: '#dbdbdb',
        textColor: 'black',
        note: '淡灰底 or 底線',
      },
      {
        label: 'gray-4',
        value: 'gray-4',
        code: '#b3b3b3',
        textColor: 'black',
        note: '較深底線或邊框',
      },
      {
        label: 'gray-5',
        value: 'gray-5',
        code: '#959595',
        textColor: 'black',
        note: '較深底線或邊框',
      },
      {
        label: 'gray-6',
        value: 'gray-6',
        code: '#8e8e8e',
        textColor: 'black',
        note: '淺灰文字',
      },
      {
        label: 'gray-7',
        value: 'gray-7',
        code: '#787878',
        textColor: 'white',
        note: '淺灰文字',
      },
      {
        label: 'gray-8',
        value: 'gray-8',
        code: '#616161',
        textColor: 'white',
        note: '深灰文字',
      },
      {
        label: 'gray-9',
        value: 'gray-9',
        code: '#404040',
        textColor: 'white',
        note: '最深灰 文字大標主色',
      },
    ],
  },
  {
    title: 'RGB for icon',
    colorInfo: [
      {
        label: 'primary',
        value: 'primary',
        code: 'rgb(0, 174, 220)',
      },
      {
        label: 'secondary',
        value: 'secondary',
        code: 'rgb(255, 179, 0)',
      },
      {
        label: 'red',
        value: 'red',
        code: 'rgb(236, 57, 41)',
      },
      {
        label: 'orange',
        value: 'orange',
        code: 'rgb(243, 117, 82)',
      },
      {
        label: 'light-primary',
        value: 'light-primary',
        code: 'rgb(225, 240, 255)',
      },
      {
        label: 'light-orange',
        value: 'light-orange',
        code: 'rgb(255, 237, 234)',
      },
      {
        label: 'light-teal',
        value: 'light-teal',
        code: 'rgb(223, 242, 244)',
      },
      {
        label: 'blue',
        value: 'blue',
        code: 'rgb(61, 120, 227)',
      },
      {
        label: 'indigo',
        value: 'indigo',
        code: 'rgb(91, 113, 185)',
      },
      {
        label: 'purple',
        value: 'purple',
        code: 'rgb(101, 89, 204)',
      },
      {
        label: 'pink',
        value: 'pink',
        code: 'rgb(247, 114, 167)',
      },
      {
        label: 'green',
        value: 'green',
        code: 'rgb(103, 177, 115)',
      },
      {
        label: 'teal',
        value: 'teal',
        code: 'rgb(2, 168, 181)',
      },
      {
        label: 'white',
        value: 'white',
        code: 'rgb(255, 255, 255)',
      },
      {
        label: 'gray',
        value: 'gray',
        code: 'rgb(142, 142, 142)',
      },
      {
        label: 'black',
        value: 'black',
        code: 'rgb(0, 0, 0)',
      },
      {
        label: 'gray-1',
        value: 'gray-1',
        code: 'rgb(244, 244, 244)',
      },
      {
        label: 'gray-2',
        value: 'gray-2',
        code: 'rgb(237, 237, 237)',
      },
      {
        label: 'gray-3',
        value: 'gray-3',
        code: 'rgb(219, 219, 219)',
      },
      {
        label: 'gray-4',
        value: 'gray-4',
        code: 'rgb(179, 179, 179)',
      },
      {
        label: 'gray-5',
        value: 'gray-5',
        code: 'rgb(149, 149, 149)',
      },
      {
        label: 'gray-6',
        value: 'gray-6',
        code: 'rgb(142, 142, 142)',
      },
      {
        label: 'gray-7',
        value: 'gray-7',
        code: 'rgb(120, 120, 120)',
      },
      {
        label: 'gray-8',
        value: 'gray-8',
        code: 'rgb(97, 97, 97)',
      },
      {
        label: 'gray-9',
        value: 'gray-9',
        code: 'rgb(64, 64, 64)',
      },
    ],
  },
]

export default function Home() {

  const [ dev, setDev ] = useState(false)

  useEffect(() => {
    if (UI_VIEW) setDev(true) 
    else window.location = '/404'
  }, [])

  const clickCopied = (val) => {
    if (!navigator?.clipboard) {
      console.warn('not supported')
      return 
    }
    
    navigator.clipboard.writeText(val)
      .then(() => {
        alert('複製成功')
      })
      .catch(() => {
        alert('複製失敗')
      })
  }
  return dev && (
    <main className={classReader('mb-5')}>
      <div className={classReader('container')}>
        <Breadcrumbs options={BREADCRUMB} />
        <h1>【Colors Options】</h1>
        {
          ALL_COLORS_INFORMATION.map((item, index) => (
            <div key={`${item.title}_${index}`}>
              <hr />
              <h2>{item.title}</h2>
              {
                item.title === '主要顏色' && item.colorInfo.map((color) => (
                  <div 
                    key={color.code}
                    className={classReader('row item cursor-pointer', { UIStyle: 'color__field' })}
                    onClick={() => clickCopied(color.value)}
                  >
                      
                    <div className={classReader('col-12 col-md-2 p-3 d-flex align-items-center')}>
                      <h3 className={classReader('m-0')} style={{
                        width: 'fit-content',
                        lineHeight: 1.5,
                      }}>{color.label}  
                        <span 
                          className={classReader(`bg-${color.value} text-white m-0`)} 
                          style={{ width: 'fit-content' }}>
                          {color.code}
                        </span>
                      </h3>
                      <div></div>
                    </div>
                    <div className={classReader('col-12 col-md-3 p-3')}>
                      <div>
                        <div className={classReader('d-flex justify-content-start align-items-center pl-0 pl-md-5')} style={{
                          width: '100%',
                          height: '50px',
                        }}>
                          <div className={classReader(`h3 text-${color.value}`)}>{`.text-${color.value}`}</div>
                        </div>
                      </div>
                    </div>
                    <div className={classReader('col-12 col-md-3 p-3')}>
                      <div>
                        <div className={classReader(`d-flex justify-content-center align-items-center bg-${color.value}`)} style={{
                          width: '100%',
                          height: '50px',
                        }}>
                          <div className={classReader('h3 text-white')}>{`.bg-${color.value}`}</div>
                        </div>
                      </div>
                    </div>
                    <div className={classReader('col-12 col-md-4 p-3')}>
                      <div>
                        <div className={classReader(`d-flex justify-content-center align-items-center border-${color.value} border`)} style={{
                          width: '100%',
                          height: '50px',
                        }}>
                          <div className={classReader('h3')}>{`.border-${color.value}`}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))  
              }
              {
                item.title === '灰色系' && <div style={{ width: '100%' }} className={classReader('d-block d-md-flex wrap mb-4')}>
                  {
                    item.colorInfo.map(color => (
                      <div 
                        key={color.code} 
                        onClick={() => clickCopied(color.value)}
                        style={{ flex: '0 0 33.3%' }}
                        className={classReader(`d-block bg-${color.value} p-5 text-${color.textColor} text-center cursor-pointer`, { UIStyle: 'color__field' })}>
                        <h3>{color.value}</h3>
                        <h3>{color.note}</h3>
                        <h3>{color.code}</h3>
                      </div>
                    ))
                  }
                </div>
              }
              {
                item.title !== '灰色系' && item.title !== '主要顏色' && <div className={classReader('row')}>
                  {item.colorInfo.map((color, index) => (
                    <div key={`${color.value}_${index}`} className={classReader('col-12 col-xl-4 col-md-12 px-3 ')}>
                      <div 
                        onClick={() => clickCopied(color.value)}
                        className={classReader(`d-flex justify-content-center align-items-center  bg-${color.value} mb-1 cursor-pointer`, { UIStyle: 'color__field' })} 
                        style={{
                          width: '100%',
                          height: '70px',
                        }}>
                        <div className={classReader('h3 text-white', { 'text-gray-5': color.value === 'white' || color.value.includes('light') || color.value.includes('gray-1') })}>{color.label} {color.code}</div>
                      </div>
                    </div>
                  ))}
                </div>
              }
            </div>
          ))
        } 

      </div>
    </main>
  )
}
