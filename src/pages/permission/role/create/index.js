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
import RoleInfo from 'page-components/permission/role/role-info'
import RolePermissionTable from 'page-components/permission/role/role-permission-table'
import Button from 'common/Button'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { getDefaultPermission } from 'utils/menu'
import roleAPI from 'apis/role'
import { useError } from 'context/ErrorContext'

export async function getServerSideProps(context) {
  const headParams = handleHeadParams(context)
  return { props: { ...headParams } }
}

const pageName = '新增角色'
const headTitle = `${pageName}${TAB_TITLE_SUFFIX}`
const defaultPermission = getDefaultPermission()

const EditRole = () => {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { reportError } = useError()

  const {
    register, handleSubmit, formState: { errors }, setValue, reset,
  } = useForm({
    ...USE_FORM_CONFIG,
    defaultValues: defaultPermission,
    shouldFocusError: true,
    sort: 0,
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    let params = {
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
        pageCode: key,
        permissionCode: data[key],
      })
    }

    try {
      await roleAPI.create({
        ...params,
        rolePermissionPages,
      })
      router.push('/permission/role')
      enqueueSnackbar('新增角色成功', { className: classReader('success bg-success-light') })
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
      <RoleInfo register={register} errors={errors} setValue={setValue}/>
    </div>
    <div className={classReader('mb-4')}>
      <RolePermissionTable register={register} errors={errors} setValue={setValue} />
    </div>
    <div className={classReader('d-flex flex-center w-100')}>
      <Button color="red" onClick={() => router.push('/permission/role')}>取消</Button>
      <Button color="green" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>建立</Button>
    </div>
  </>
}
export default EditRole
EditRole.layout = (page) => <Layout>{page}</Layout>