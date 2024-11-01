import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import classReader from 'utils/classReader'
import { handleHeadParams } from 'utils/util'
import Layout from 'common/layout/Layout'
import Breadcrumbs from 'common/Breadcrumbs'
import { BREADCRUMBS_OPTION } from 'config/breadcrumbs'
import { TAB_TITLE_SUFFIX } from 'config/head'
import Head from 'next/head'
import { USE_FORM_CONFIG } from 'config/config'
import Button from 'common/Button'
import { useRouter } from 'next/router'
import Input from 'common/form/Input'
import Select from 'common/form/Select'
import CardSection from 'common/card/CardSection'
import MultiSelectInput from 'common/form/MultiSelectInput'
import planAPI from 'apis/plan'
import { useSnackbar } from 'notistack'
import { useError } from 'context/ErrorContext'
import { hookFormValidates } from 'utils/hookFormValidates'

export async function getServerSideProps(context) {
  const headParams = handleHeadParams(context)
  return { props: { ...headParams } }
}

const pageName = '新增方案管理'
const headTitle = `${pageName}${TAB_TITLE_SUFFIX}`


const CreatePlan = (props) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const { reportError } = useError()

  const {
    register, handleSubmit, control, formState: { errors }, setValue, reset, getValues,
  } = useForm({
    ...USE_FORM_CONFIG,
    defaultValues: {
      isEnabled: true,
      planContent: [],
      planName: '',
      price: '',
      tag: [],
    },
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const result = await planAPI.create(data)
      if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })

      enqueueSnackbar('新增方案成功', { className: classReader('success bg-success-light') })
      await router.push('/permission/plan')

    } catch (err) {
      reportError(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return <>
    <Head>
      <title>{headTitle}</title>
    </Head>

    <div className={classReader('mb-4')}>
      <Breadcrumbs
        title={pageName}
        options={BREADCRUMBS_OPTION}
      />
    </div>

    <div className={classReader('mb-4')}>
      <CardSection className={classReader('')}>
        <div className={classReader('h5 bold px-2')}>
          方案資訊
        </div>
        
        <div className={classReader('px-2')}>
          <div className={classReader('border-top mt-3 mb-3')}></div>
        </div>

        <div className={classReader('row')}>
          <div className={classReader('col-12')}>
            <div className={classReader('px-2')}>
              <div className={classReader('text-title text-required')}>方案名稱</div>
              <Input
                name="planName"
                register={register}
                validate={hookFormValidates().planName}
                controllerError={errors?.planName?.message}
              />
            </div>
          </div>

          <div className={classReader('col-12 col-md-6')}>
            <div className={classReader('px-2')}>
              <div className={classReader('text-title text-required')}>方案金額</div>
              <Input
                name="price"
                type="number"
                register={register}
                validate={hookFormValidates().planPrice}
                controllerError={errors?.price?.message}
              />
            </div>
          </div>

          <div className={classReader('col-12 col-md-6')}>
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

          <div className={classReader('col-12')}>
            <div className={classReader('px-2')}>
              <div className={classReader('text-title')}>標籤</div>
              <MultiSelectInput
                name="tag"
                placeholder={'輸入完畢後，按Enter 可新增標籤，請勿填入特殊字元或標點符號'}
                control={control}
                validate={hookFormValidates().tags}
                getValues={getValues}
              />
            </div>
          </div>

          <div className={classReader('col-12')}>
            <div className={classReader('px-2')}>
              <div className={classReader('text-title text-required')}>方案內容</div>
              <MultiSelectInput
                name="planContent"
                placeholder={'輸入完畢後，按Enter 可新增方案內容'}
                control={control}
                validate={hookFormValidates().planContent}
                getValues={getValues}
              />
            </div>
          </div>

        </div>
      </CardSection>
    </div>
    <div className={classReader('d-flex flex-center w-100')}>
      <Button color="red" onClick={() => router.push('/permission/plan')}>取消</Button>
      <Button color="gray-5" textColor="text-secondary" onClick={() => reset()}>重置</Button>
      <Button color="green" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>建立</Button>
    </div>
  </>
}
export default CreatePlan
CreatePlan.layout = (page) => <Layout>{page}</Layout>