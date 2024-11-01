import React from 'react'
import classReader from 'utils/classReader'
import Input from 'common/form/Input'
import CardSection from 'common/card/CardSection'
import Select from 'common/form/Select'
import { hookFormValidates } from 'utils/hookFormValidates'

const PermissionInfo = ({
  errors,
  register,
  setValue,  
}) => {
  
  return (
    <CardSection className={classReader('')}>
      <div className={classReader('h5 bold px-2')}>權限設置</div>
      
      <div className={classReader('px-2')}>
        <div className={classReader('border-top mt-3 mb-3')}></div>
      </div>

      <div className={classReader('row')}>
        <div className={classReader('col-12 col-md-4')}>
          <div className={classReader('px-2')}>
            <div className={classReader('text-title text-required')}>姓名</div>
            <Input
              name="memberName"
              register={register}
              validate={hookFormValidates().name}
              controllerError={errors?.memberName?.message}
            />
          </div>
        </div>

        <div className={classReader('col-12 col-md-4')}>
          <div className={classReader('px-2')}>
            <div className={classReader('text-title text-required')}>Email</div>
            <Input
              name="email"
              register={register}
              validate={hookFormValidates().email}
              controllerError={errors?.email?.message}
            />
          </div>
        </div>

        <div className={classReader('col-12 col-md-4')}>
          <div className={classReader('px-2')}>
            <div className={classReader('text-title')}>角色權限</div>
            <Select
              options={[
                {
                  label: '專案管理者',
                  value: '9999',
                },
              ]}
              value={'9999'}
              disabled={true}
            />
          </div>
        </div>
      </div>
    </CardSection>
  )
}

export default PermissionInfo