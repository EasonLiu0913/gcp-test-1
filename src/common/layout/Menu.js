import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import classReader from 'utils/classReader'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { selectMenu } from 'slices/userSlice'

const Menu = () => {
  const allowedMenu = useSelector(selectMenu)
  const router = useRouter()

  return <div className={classReader('menu')}>
    <div className={classReader('d-flex flex-column scrollbar-y h-100')}>
        
      <div className={classReader('menu__logo public-padding d-flex flex-row align-items-center')}>
        {/* 因 console 報錯警告 fetchPriority，故此處不使用 nextJS Image */}
        {/* <Image src="/logo.svg" width={32} height={32} alt="logo" className={classReader('mr-2')} priority/> */}
        <img src="/logo.svg" width={200} height={70} alt="logo" />
      </div>

      <div className={classReader('menu__content  public-padding')}>
        {
          allowedMenu.map((item, index) => {
            const isSelected = router.pathname.startsWith(item.link)
            return (
              <details key={index} open={isSelected}>
                {item.sub ? <>
                  <summary className={classReader('item', { isSelected })}>
                    <i className={
                      classReader(`icon icon-${item.icon}`,
                        isSelected ? 'icon-white' : 'icon-block')}
                    />
                    <i className={classReader(`icon icon-${item.icon} icon-primary`)} />
                    <div className={classReader('w-100')}>{item.display}</div>
                    <i className={
                      classReader('icon icon-arrow-down',
                        isSelected ? 'icon-white' : 'icon-block')}
                    />
                    <i className={classReader('icon icon-arrow-down icon-primary')} />
                  </summary>
                  {item.sub.map((list, index) => {
                    const listIsSelected = router.pathname.startsWith(list.link)
                    return (
                      (
                        <Link key={index} href={list.link}>
                          { }
                          <li className={classReader(
                            'item sub',
                            listIsSelected ? 'primary' : 'block', list?.hidden && 'd-none',
                          )}
                          >
                            {list.display}
                          </li>
                        </Link>
                      )
                    )
                  })}
                </> : <summary className={classReader('item', { isSelected })}>
                  <Link href={item.link} className={classReader('d-flex flex-row flex-center')}>
                    <i className={
                      classReader(`icon icon-${item.icon}`,
                        isSelected ? 'icon-white' : 'icon-block')}
                    />
                    <i className={classReader(`icon icon-${item.icon} icon-primary`)} />
                    <div className={classReader('w-100', { white: isSelected })}>{item.display}</div>
                  </Link>
                </summary>}
              </details>
            )
          })
        }
      </div>

      <div className={classReader('text-center p-3 border-top')}>
        <Link 
          className={classReader('primary')}
          href={'/download/OmniU品牌網域_操作手冊(平台版)_240716.pdf'}
          target="_blank"
          download={true}
        >
          操作手冊
        </Link>
      </div>
    </div>
  </div>
}

export default Menu