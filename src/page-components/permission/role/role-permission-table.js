import React, { Fragment, useState } from 'react'
import classReader from 'utils/classReader'
import CardSection from 'common/card/CardSection'
import RadioGroup from 'common/form/RadioGroup'
import { MENU } from 'config/menu'

const RolePermissionTable = ({ register }) => {
  
  const RenderRow = ({ item, isSub }) => {
    // 部份權限不給修改的，直接不顯示
    if (item.isPermissionsFixed) return

    if (item.sub) {
      return [
        <Fragment key={item.id}>
          <div className={classReader('d-flex align-items-center bold')}>
            {item.display}
          </div>
          <div />
          <div />
          <div />
          <div />
        </Fragment>,
        item.sub.map( i => <Fragment key={i.id}>
          <RenderRow item={i} isSub={true} />
        </Fragment>),
      ]
    } else {
      return <>
        <div className={classReader('d-flex align-items-center bold', { 'pl-4': isSub })}>
          {item.display}
        </div>
        <RadioGroup
          className={'d-flex flex-center'}
          options={[
            { value: 'RWD' },
            { value: 'RW' },
            { value: 'V' },
            { value: 'BAN' },
          ]}
          name={item.id}
          isCheckStyle={true}
          register={register}
        />
      </>
    }
  }

  return (
    <CardSection className={classReader('p-4')}>
      <div className={classReader({ PermissionStyle: 'role-permission-table__grid' })}>
        <div className={classReader('text-secondary d-flex align-items-center')}>Menu 名稱</div>
        <div className={classReader('text-secondary d-flex flex-center')}>可讀寫與刪除</div>
        <div className={classReader('text-secondary d-flex flex-center')}>可讀寫</div>
        <div className={classReader('text-secondary d-flex flex-center')}>唯讀</div>
        <div className={classReader('text-secondary d-flex flex-center')}>禁止存取</div>
        {MENU.map(item => <Fragment key={item.id}>
          <RenderRow item={item}/>
        </Fragment>)}
      </div>
      <div className={classReader('px-2 py-4 text-secondary')}>{'注意：權限層級：禁止存取 > 唯獨 > 可讀寫 > 可讀寫與刪除'}</div>
    </CardSection>
  )
}

export default RolePermissionTable