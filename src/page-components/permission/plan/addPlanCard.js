import React from 'react'
import Card from 'common/card/Card'
import classReader from 'utils/classReader'
import Link from 'next/link'

const AddPlanCard = () => {
  return (
    <Card className={classReader('bg-primary-light', { PermissionStyle: 'plan-card' })}>
      <Link
        className={classReader('')}
        href="/permission/plan/create" >
        <div className={classReader('d-flex flex-center flex-column h-100')}>
          <div className={classReader('mb-2', { PermissionStyle: 'dash-circle' })}>
            <i className={classReader('icon icon-add icon-primary')} />
          </div>
          <div className={classReader('h5 primary')}>新增方案</div>
        </div>
      </Link>
    </Card>
  )
}

export default AddPlanCard