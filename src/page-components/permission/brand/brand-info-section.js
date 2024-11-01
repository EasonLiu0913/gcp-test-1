import React, { useEffect, useState } from 'react'
import classReader from 'utils/classReader'
import Input from 'common/form/Input'
import CardSection from 'common/card/CardSection'
import Select from 'common/form/Select'
import DatePicker from 'common/form/DatePicker'
import planAPI from 'apis/plan'
import { useError } from 'context/ErrorContext'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { hookFormValidates } from 'utils/hookFormValidates'

const BrandInfo = ({
  control,
  errors,
  isEditMode = false,
  register,
  setValue,  
}) => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { reportError } = useError()
  const [planList, setPlanList] = useState([])

  const getPlanSelectList = async () => {
    dispatch({ type: 'loading/openLoading' })
    try {
      const result = await planAPI.getPlanSelectList({ pageSize: 100 })
      if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })
      setPlanList(result.data.map( item => {
        return {
          label: item.value,
          value: item.key,
        }
      }))
    } catch (err) {
      err.message = '取得方案清單失敗，請稍候再試'
      reportError(err)
      await router.push('/permission/brand')
    } finally {
      dispatch({ type: 'loading/closeLoading' })
    }
  }

  useEffect(() => {
    setTimeout(() => {
      getPlanSelectList()
    }, 2000)
  }, [] )

  return (
    <CardSection className={classReader('')}>
      <div className={classReader('h5 bold px-2')}>品牌資訊</div>
      
      <div className={classReader('px-2')}>
        <div className={classReader('border-top mt-3 mb-3')}></div>
      </div>

      <div className={classReader('row')}>
        <div className={classReader('col-12 col-md-6 col-lg-4')}>
          <div className={classReader('px-2')}>
            <div className={classReader('text-title text-required')}>品牌名稱</div>
            <Input
              name="brandName"
              register={register}
              validate={hookFormValidates().brandName}
              controllerError={errors?.brandName?.message}
            />
          </div>
        </div>

        <div className={classReader('col-12 col-md-6 col-lg-4')}>
          <div className={classReader('px-2')}>
            <div className={classReader('text-title text-required')}>品牌網域</div>
            <Input
              name="brandDomain"
              register={register}
              validate={hookFormValidates().brandDomain}
              controllerError={errors?.brandDomain?.message}
              disabled={isEditMode}
            />
          </div>
        </div>

        <div className={classReader('col-12 col-md-6 col-lg-4')}>
          <div className={classReader('px-2')}>
            <div className={classReader('text-title')}>啟用狀態</div>
            <Select
              name="isEnabled"
              options={[
                {
                  label: '啟用',
                  value: true,
                },
                {
                  label: '停用',
                  value: false,
                },
              ]}
              register={register}
              onChange={(name, val) => setValue(name, val)}
            />
          </div>
        </div>

        <div className={classReader('col-12 col-md-6 col-lg-4')}>
          <div className={classReader('px-2')}>
            <div className={classReader('text-title text-required')}>選購方案</div>
            <Select
              name="planId"
              options={planList}
              register={register}
              onChange={(name, val) => setValue(name, val)}
              controllerError={errors?.planId?.message}
              validate={hookFormValidates().planId}
            />
          </div>
        </div>

        <div className={classReader('col-12 col-md-6 col-lg-4')}>
          <div className={classReader('px-2')}>
            <div className={classReader('text-title text-required')}>服務起訖日期（起）</div>
            <DatePicker
              className={classReader('mb-4')}
              name="planStartDate"
              control={control}
              controllerError={errors?.planStartDate?.message}
              validate={hookFormValidates().planStartDate}
            />
          </div>
        </div>

        <div className={classReader('col-12 col-md-6 col-lg-4')}>
          <div className={classReader('px-2')}>
            <div className={classReader('text-title text-required')}>服務起訖日期（迄）</div>
            <DatePicker
              className={classReader('mb-4')}
              name="planEndDate"
              control={control}
              controllerError={errors?.planEndDate?.message}
              validate={hookFormValidates().planEndDate}
            />
          </div>
        </div>

        <div className={classReader('col-12 col-md-6 col-lg-4')}>
          <div className={classReader('px-2')}>
            <div className={classReader('text-title')}>合約起訖日期（起）</div>
            <DatePicker
              className={classReader('mb-4')}
              name="contractStartDate"
              control={control}
            />
          </div>
        </div>

        <div className={classReader('col-12 col-md-6 col-lg-4')}>
          <div className={classReader('px-2')}>
            <div className={classReader('text-title')}>合約起訖日期（迄）</div>
            <DatePicker
              className={classReader('mb-4')}
              name="contractEndDate"
              control={control}
            />
          </div>
        </div>
      </div>
    </CardSection>
  )
}

export default BrandInfo