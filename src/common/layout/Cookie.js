import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'
import Button from 'common/Button'
import TabList from 'common/tabs/TabList'
import { TAB_CHILD_LIST, TAB_PARENT_LIST } from 'config/cookie'

const Cookie = () => {
  const [activeTab, setActiveTab] = useState('Tab001')
  const [activeChildTab, setActiveChildTab] = useState('Tab003')
  const [isOpenAnnounce, setIsOpenAnnounce] = useState(false)
  
  TAB_PARENT_LIST[0].panel = <TabList
    activeTab={activeChildTab}
    tabData={TAB_CHILD_LIST}
    onClick={setActiveChildTab}
    color="gray-8"
    textColor="light"
    panelColor="gray-7"
    activeColor="primary"
    vertical
    indicator
    separator
  />
  
  return (
    <section className={classReader('cookie')}>
      <div className={classReader('absolute-bottom cookie--backdrop')}>
        <div className={classReader('container cookie__content')}>
          <h2>本網站使用cookie</h2>
          <h4>點擊「允許所有Cookies」，即表示您同意我們在您的瀏覽器儲存所有Cookies，我們將用於維護網站安全性、改善網站效能、分析使用情形，並用於廣告或行銷。若要調整或查看更多資訊，請點擊「顯示詳情」，或詳見隱私權條款說明。</h4>

          <div className={classReader('d-flex')}>
            <Button
              className={classReader('mr-4 py-1 px-4')}
              size="sm"
              label=" 僅使用必要Cookies"
              color="gray"
            />

            <Button
              className={classReader('py-1 px-4')}
              label="  允許所有Cookies"
              size="sm"
              color="primary"
            />
          </div>

          <div className={classReader('d-flex justify-content-end')}>
            <Button
              className={classReader('mt-3 py-1')}
              label={`${isOpenAnnounce ? '隱藏' : '顯示'}詳情`}
              color="white"
              iconRight={isOpenAnnounce ? 'arrow-up' : 'arrow-down'}
              onClick={() => setIsOpenAnnounce(prev => !prev)}
              flat
            />
          </div>
        </div>

        <div className={classReader('container cookie__content cookie--announce text-sm')} data-active={isOpenAnnounce}>
          <TabList
            activeTab={activeTab}
            tabData={TAB_PARENT_LIST}
            onClick={setActiveTab}
            color="gray-8"
            textColor="light"
            panelColor="gray-8"
            activeColor="primary"
            separator
          />
        </div>
      </div>
    </section>
  )
}

Cookie.propTypes = {}

export default Cookie