import React, { useState, useEffect } from 'react'
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
import BrandInfoSection from 'page-components/permission/brand/brand-info-section'
import PermissionSection from 'page-components/permission/brand/permission-section-create'
import projectAPI from 'apis/project'
import { useSnackbar } from 'notistack'
import { selectUser } from 'slices/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useError } from 'context/ErrorContext'
import { getCurrentTimestamp } from 'utils/date'

export async function getServerSideProps(context) {
  const headParams = handleHeadParams(context)
  return { props: { ...headParams } }
}

const pageName = '新增品牌網域'
const headTitle = `${pageName}${TAB_TITLE_SUFFIX}`

let formDefaultValues = {
  brandName: '',
  brandDomain: '',
  isEnabled: true,
  memberName: '',
  planStartDate: '',
  planEndDate: '',
  contractStartDate: undefined, // 非必填，給 undefined，讓其自動過濾
  contractEndDate: undefined, // 非必填，給 undefined，讓其自動過濾
  planId: '',
  email: '',
}

const CreateDomain = ({ setCurrentUser }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const user = useSelector(selectUser)
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useDispatch()
  const { reportError } = useError()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
    getValues,
  } = useForm({
    ...USE_FORM_CONFIG,
    defaultValues: formDefaultValues,
  })
  
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    dispatch({ type: 'loading/openLoading' })
    try {
      const params = {
        ...data,
        returnUrl: `${process.env.NEXT_PUBLIC_DOMAIN }/login/activate`,
      }
      const result = await projectAPI.createBrandDomain(params)
      if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })
     
      enqueueSnackbar('新增成功', { className: classReader('success bg-success-light') })
      
      // 新增成功，進行比對
      if (data.email === user.email) {
        // 重新整理以更新所有資訊
        router.push(router.asPath, { query: { t: getCurrentTimestamp() } })
      }

      await router.push('/permission/brand')
    } catch (err) {
      reportError(err)
    } finally {
      setIsSubmitting(false)
      dispatch({ type: 'loading/closeLoading' })
    }
  }

  useEffect(() => {
    if (router.isReady && Object.keys(router.query).length) {
      formDefaultValues = {
        ...formDefaultValues,
        ...router.query,
      }
      reset(formDefaultValues)
    }
  }, [router.isReady])

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
      <BrandInfoSection
        register={register}
        errors={errors}
        setValue={setValue}
        control={control}
        getValues={getValues}
      />
    </div>
    <div className={classReader('mb-4')}>
      <PermissionSection
        register={register}
        errors={errors}
        setValue={setValue}
      />
    </div>
    <div className={classReader('d-flex flex-center w-100')}>
      <Button
        color="red"
        onClick={() => router.push('/permission/brand')}
        label="取消"
      />
      <Button 
        color="gray-5"
        textColor="text-secondary"
        onClick={() => reset()}
        label="重置"/>
      <Button 
        color="green"
        onClick={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
        label={'建立'}
      />
    </div>
  </>
}
export default CreateDomain
CreateDomain.layout = (page) => <Layout>{page}</Layout>