import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import classReader from 'utils/classReader'
import Layout from 'common/layout/Layout'
import Breadcrumbs from 'common/Breadcrumbs'
import { BREADCRUMBS_OPTION } from 'config/breadcrumbs'
import { TAB_TITLE_SUFFIX } from 'config/head'
import Head from 'next/head'
import { USE_FORM_CONFIG } from 'config/config'
import Button from 'common/Button'
import { useRouter } from 'next/router'
import BrandInfoSection from 'page-components/permission/brand/brand-info-section'
import projectAPI from 'apis/project'
import { useSnackbar } from 'notistack'
import { useDispatch } from 'react-redux'
import { useError } from 'context/ErrorContext'

const pageName = '編輯品牌網域'
const headTitle = `${pageName}${TAB_TITLE_SUFFIX}`

const EditDomain = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useDispatch()
  const router = useRouter()
  const { reportError } = useError()

  const {
    register, control, formState: { errors }, setValue, getValues, reset, handleSubmit,
  } = useForm({ ...USE_FORM_CONFIG })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    dispatch({ type: 'loading/openLoading' })
    try {
      const result = await projectAPI.editBrandDomain(data)
      if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })
      enqueueSnackbar('編緝品牌成功', { className: classReader('success bg-success-light') })
      await router.push('/permission/brand')
    } catch (err) {
      reportError(err)
    } finally {
      setIsSubmitting(false)
      dispatch({ type: 'loading/closeLoading' })
    }
  }

  const handleGetById = async () => {
    dispatch({ type: 'loading/openLoading' })
    try {
      const result = await projectAPI.getById({ id: router.query.id })
      if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })
      reset(result.data)
    } catch (err) {
      err.message = '品牌資訊讀取失敗，請稍候再試'
      reportError(err)
      await router.push('/permission/brand')
    } finally {
      dispatch({ type: 'loading/closeLoading' })
    }
  }

  useEffect(() => {
    if (router.isReady) handleGetById()
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
        isEditMode={true}
      />
    </div>
    <div className={classReader('d-flex flex-center w-100')}>
      <Button color="red" onClick={() => router.push('/permission/brand')}>取消</Button>
      <Button color="gray-5" textColor="text-secondary" onClick={() => reset()}>重置</Button>
      <Button color="green" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>儲存</Button>
    </div>
    
  </>
}
export default EditDomain
EditDomain.layout = (page) => <Layout>{page}</Layout>