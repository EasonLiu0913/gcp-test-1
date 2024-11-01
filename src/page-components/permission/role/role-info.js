import React from 'react'
import classReader from 'utils/classReader'
import Input from 'common/form/Input'
import CardSection from 'common/card/CardSection'
import Select from 'common/form/Select'
import Textarea from 'common/form/Textarea'
import { hookFormValidates } from 'utils/hookFormValidates'

const RoleInfo = ({
  errors,
  isEdit,
  register,
  setValue,  
}) => {
  return (
    <CardSection>
      <div className={classReader('row')}>
        <div className={classReader('col-12 col-md-4')}>
          <div className={classReader('px-2')}>
            <div className={classReader('text-title text-required')}>角色英文名稱</div>
            <Input
              name="roleCode"
              register={register}
              validate={hookFormValidates().roleCode}
              controllerError={errors?.roleCode?.message}
              disabled={isEdit === true}
            />
          </div>
        </div>

        <div className={classReader('col-12 col-md-4')}>
          <div className={classReader('px-2')}>
            <div className={classReader('text-title text-required')}>角色中文名稱</div>
            <Input
              name="roleName"
              register={register}
              validate={hookFormValidates().roleName}
              controllerError={errors?.roleName?.message}
            />
          </div>
        </div>

        <div className={classReader('col-12 col-md-4')}>
          <div className={classReader('px-2')}>
            <div className={classReader('text-title text-required')}>查看他人資料</div>
            <Select
              name="isCheckOther"
              options={[
                {
                  label: '是',
                  value: true,
                },
                {
                  label: '否',
                  value: false,
                },
              ]}
              register={register}
              onChange={(name, val) => setValue(name, val)}
              validate={hookFormValidates().isCheckOther}
              controllerError={errors?.isCheckOther?.message}
            />
          </div>
        </div>

        <div className={classReader('col-12')}>
          <div className={classReader('px-2')}>
            <div className={classReader('text-title text-required')}>角色描述</div>
            <Textarea
              resize={false}
              name="roleDesc"
              register={register}
              validate={hookFormValidates().roleDesc}
              controllerError={errors?.roleDesc?.message}
            />
          </div>
        </div>

      </div>
    </CardSection>
  )
}

export default RoleInfo