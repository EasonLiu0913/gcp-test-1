import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import classReader from 'utils/classReader'
import { handleHeadParams } from 'utils/util'
import Layout from 'common/layout/Layout'
import Breadcrumbs from 'common/Breadcrumbs'
import { BREADCRUMBS_OPTION } from 'config/breadcrumbs'
import { TAB_TITLE_SUFFIX } from 'config/head'
import Head from 'next/head'
import { USE_FORM_CONFIG } from 'config/config'
import RoleInfo from 'page-components/permission/role/role-info'
import RolePermissionTable from 'page-components/permission/role/role-permission-table'
import Button from 'common/Button'
import { useRouter } from 'next/router'
import roleAPI from 'apis/role'
import { useDispatch } from 'react-redux'
import { useSnackbar } from 'notistack'
import { getDefaultPermission } from 'utils/menu'
import { useError } from 'context/ErrorContext'

export async function getServerSideProps(context) {
  const headParams = handleHeadParams(context)
  return { props: { ...headParams } }
}

const pageName = '編輯角色'
const headTitle = `${pageName}${TAB_TITLE_SUFFIX}`

const EditRole = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { reportError } = useError()

  const {
    register, handleSubmit, formState: { errors }, setValue, reset,
  } = useForm({
    ...USE_FORM_CONFIG,
    sort: 0,
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    let params = {
      id: router.query.id,
      roleCode: data.roleCode,
      roleName: data.roleName,
      roleDesc: data.roleDesc,
      isCheckOther: data.isCheckOther,
    }
    delete data.roleCode
    delete data.roleName
    delete data.roleDesc
    delete data.isCheckOther

    let rolePermissionPages = []
    
    for (let key in data) {
      rolePermissionPages.push({
        roleId: router.query.id,
        pageCode: key,
        permissionCode: data[key],
      })
    }

    try {
      await roleAPI.edit({
        ...params,
        rolePermissionPages,
      })
      await router.push('/permission/role')
      enqueueSnackbar('編輯角色成功', { className: classReader('success bg-success-light') })
    } catch (err) {
      reportError(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePromise = async () => {
    dispatch({ type: 'loading/openLoading' })
    try {
      const results = await Promise.all([roleAPI.getById({ id: router.query.id }), roleAPI.getPageByRoleId({ roleId: router.query.id })])
      console.log('handlePromise ~ results:', results)
      const [roleResult, permissionResult] = results
      if (!roleResult.success) return reportError({ errorNo: roleResult.errorNo || 9999 })
      if (!permissionResult.success) return reportError({ errorNo: permissionResult.errorNo || 9999 })

      let permission = getDefaultPermission()
      if (Array.isArray(permissionResult.data)) {
        permissionResult.data.forEach( item => {
          permission[item.pageCode] = item.permissionCode
        })
      }

      reset({
        roleCode: roleResult.data.roleCode,
        roleName: roleResult.data.roleName,
        isCheckOther: roleResult.data.isCheckOther,
        roleDesc: roleResult.data.roleDesc,
        ...permission,
      })

    } catch (err) {
      reportError(err)
      await router.push('/permission/role')
    } finally {
      dispatch({ type: 'loading/closeLoading' })
    }
  }

  useEffect(() => {
    handlePromise()
  }, [])

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
      <RoleInfo register={register} errors={errors} setValue={setValue} isEdit={true}/>
    </div>
    <div className={classReader('mb-4')}>
      <RolePermissionTable register={register} errors={errors} setValue={setValue} />
    </div>
    <div className={classReader('d-flex flex-center w-100')}>
      <Button color="red" onClick={() => router.push('/permission/role')}>取消</Button>
      <Button color="gray-5" textColor="text-secondary" onClick={() => reset()}>重置</Button>
      <Button color="green" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>確認</Button>
    </div>
  </>
}
export default EditRole
EditRole.layout = (page) => <Layout>{page}</Layout>