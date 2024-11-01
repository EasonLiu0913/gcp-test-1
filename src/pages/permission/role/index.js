import React, {
  memo, useRef, useState, 
} from 'react'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import classReader from 'utils/classReader'
import { handleHeadParams, useCheckPermission } from 'utils/util'
import { USE_FORM_CONFIG } from 'config/config'
import { TAB_TITLE_SUFFIX } from 'config/head'
import { BREADCRUMBS_OPTION } from 'config/breadcrumbs'
import Breadcrumbs from 'common/Breadcrumbs'
import Layout from 'common/layout/Layout'
import Button from 'common/Button'
import { useRouter } from 'next/router'
import roleAPI from 'apis/role'
import { roleFormatter } from 'utils/dataFormatter'
import TableWithSearch from 'src/common/TableWithSearch'

// 預留 SSR 區塊
export async function getServerSideProps(context) {
  const headParams = handleHeadParams(context)
  return { props: { ...headParams } }
}

const pageCode = '201'
const pageName = '角色權限管理'
const headTitle = `${pageName}${TAB_TITLE_SUFFIX}`

const Role = () => {
  const [tagsFromUserClick] = useState([])
  const router = useRouter()
  const [R, W] = useCheckPermission(pageCode)
  const tableRef = useRef('')
  const {
    register, handleSubmit, control, reset, setValue, getValues, formState: { errors },
  } = useForm({
    ...USE_FORM_CONFIG,
    defaultValues: { pageSize: 10 },
  })

  const SearchBarChildren = memo( function SearchBarChildren() {
    return <></>
  })

  const tableColumns = [
    {
      name: 'index',
      label: '編號',
      options: {
        customHeadLabelRender: (columnMeta) => <div className={classReader('text-center')}>{columnMeta.label}</div>,
        customBodyRender: (value) => {
          return <div className={classReader('column-index text-center')}>
            {value}
          </div>
        },
      },
    },
    {
      name: 'roleName',
      label: '權限名稱（中）',
      options: {
        customBodyRender: value => (
          <div className={classReader('column-basic-3')}>{value}</div>
        ),
      },
    },
    {
      name: 'roleCode',
      label: '權限名稱（英）',
      options: {
        customBodyRender: value => (
          <div className={classReader('column-basic-3')}>{value}</div>
        ),
      },
    },
    {
      name: 'isCheckOther',
      label: '查看他人資料',
      options: {
        customHeadLabelRender: (columnMeta) => <div className={classReader('text-center')}>{columnMeta.label}</div>,
        customBodyRender: value => (
          <div className={classReader('column-basic-3 text-center', { 'text-secondary': !value })}>
            {value ? '是' : '否'}
          </div>
        ),
      },
    },
    {
      name: 'action',
      label: '編輯',
      options: {
        customHeadLabelRender: (columnMeta) => ( W &&
          <div className={classReader('text-center')}>{columnMeta.label}</div>
        ),
        customBodyRender: (value) => ( W &&
          <div className={classReader('action-column')}>
            <div
              className={classReader('bg-green action-btn')}
              onClick={() => router.push(`/permission/role/edit/${value.id}`)}
            >
              <i className={classReader('icon icon-edit icon-white')}/>
            </div>
          </div>
        ),
      },
    },
  ]

  const CreateButton = memo(function CreateButton() {
    return W && <Button
      className={classReader('table-header-btn m-0')}
      color="green"
      label="新增"
      onClick={() => {router.push('/permission/role/create')}}
    />
  })

  return (
    <>
      <Head>
        <title>{headTitle}</title>
      </Head>

      <div className={classReader('mb-4')}>
        <Breadcrumbs
          title={pageName}
          options={BREADCRUMBS_OPTION}
        />
      </div>

      <TableWithSearch
        fetchAPI={roleAPI.get}
        APIResultFormatter={roleFormatter}
        tableColumns={tableColumns}
        tagsFromUserClick={tagsFromUserClick} 
        customToolbar={() => <CreateButton />}
        searchBarClassName="d-none"
        searchBarChildren={() => <SearchBarChildren />}
        handleSubmit={handleSubmit}
        reset={reset}
        setValue={setValue}
        getValues={getValues}
        ref={tableRef}
      />
    </>
  )
}

export default Role
Role.layout = (page) => <Layout>{page}</Layout>