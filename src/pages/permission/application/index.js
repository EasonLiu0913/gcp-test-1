import React, {
  useState, memo, useRef,
} from 'react'
import Head from 'next/head'
import classReader from 'utils/classReader'
import { handleHeadParams, useCheckPermission } from 'utils/util'
import { TAB_TITLE_SUFFIX } from 'config/head'
import { BREADCRUMBS_OPTION } from 'config/breadcrumbs'
import Breadcrumbs from 'common/Breadcrumbs'
import Layout from 'common/layout/Layout'
import applicationAPI from 'apis/application'
import { applicationFormatter } from 'utils/dataFormatter'
import { useSnackbar } from 'notistack'
import TableWithSearch from 'common/TableWithSearch'
import Badge from 'common/Badge'
import Select from 'common/form/Select'
import Modal from 'common/Modal'
import { useRouter } from 'next/router'
import Input from 'common/form/Input'
import { useForm } from 'react-hook-form'
import { USE_FORM_CONFIG } from 'config/config'
import { useError } from 'context/ErrorContext'

// 預留 SSR 區塊
export async function getServerSideProps(context) {
  const headParams = handleHeadParams(context)
  return { props: { ...headParams } }
}

const pageCode = '204'
const pageName = '申請單管理'
const headTitle = `${pageName}${TAB_TITLE_SUFFIX}`

const AllUserManagement = () => {
  const [tagsFromUserClick] = useState([])
  const tableRef = useRef(null)
  const [editDlgData, setEditDlgData] = useState({})
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [R, W] = useCheckPermission(pageCode)
  const { reportError } = useError()

  const searchBarUseForm = useForm({
    ...USE_FORM_CONFIG,
    defaultValues: {
      status: '',
      email: '',
      pageSize: 10,
    },
  })
  const editDlgUseForm = useForm({ ...USE_FORM_CONFIG })

  const SearchBarChildren = memo(function SearchBarChildren() {
    return <>
      <div className={classReader('col-12 col-sm-6')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>申請單狀態</div>
          <Select
            name="status"
            options={[
              {
                label: '待審核',
                value: '0',
              },
              {
                label: 'inFra 設定中',
                value: '1',
              },
              {
                label: '申請駁回',
                value: '2',
              },
              {
                label: '審核通過',
                value: '3',
              },
            ]}
            register={searchBarUseForm.register}
            onChange={(name, val) => searchBarUseForm.setValue(name, val)}
          />
        </div>
      </div>

      <div className={classReader('col-12 col-sm-6')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>Email</div>
          <Input
            name="email"
            register={searchBarUseForm.register}
          />
        </div>
      </div>
    </>
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
      name: 'name',
      label: '姓名',
      options: {
        customBodyRender: (value) => <div
          className={classReader('column-basic-4')}>
          {value}
        </div>,
      },
    },
    {
      name: 'email',
      label: 'Email',
      options: {
        customBodyRender: (value) => <div
          className={classReader('column-basic-5 word-break')}>
          {value}
        </div>,
      },
    },
    {
      name: 'brandName',
      label: '品牌名稱',
      options: {
        customBodyRender: (value) => <div
          className={classReader('column-basic-3')}>
          {value}
        </div>,
      },
    },
    {
      name: 'brandDomain',
      label: '網域名稱',
      options: {
        customBodyRender: (value) => <div
          className={classReader('column-basic-5 word-break')}>
          {value}
        </div>,
      },
    },
    {
      name: 'createDate',
      label: '申請時間',
      options: {
        customHeadLabelRender: (columnMeta ) => <div className={classReader('text-center')}>{columnMeta.label}</div>,
        customBodyRender: (value) => <div
          className={classReader('text-center column-date')}>
          <div>{value}</div>
        </div>,
      },
    },
    {
      name: 'modifyDate',
      label: '審核時間',
      options: {
        customHeadLabelRender: (columnMeta ) => <div className={classReader('text-center')}>{columnMeta.label}</div>,
        customBodyRender: (value) => <div
          className={classReader('text-center column-date')}>
          <div>{value}</div>
        </div>,
      },
    },
    {
      name: 'status',
      label: ' 狀態',
      options: {
        customHeadLabelRender: (columnMeta) => <div className={classReader('text-center')}>{columnMeta.label}</div>,
        customBodyRender: value => {
          switch (value) {
          case 0:
            return <div className={classReader('column-basic-2 text-center')}>
              <Badge className={classReader('px-3')} color="warning" outline rounded>待審核</Badge>
            </div>
          case 1:
            return <div className={classReader('column-basic-2 text-center')}>
              <Badge className={classReader('px-3')} color="text-secondary" outline rounded>inFra 設定中</Badge>
            </div>
          case 2:
            return <div className={classReader('column-basic-2 text-center')}>
              <Badge className={classReader('px-3')} color="error" rounded>駁回</Badge>
            </div>
          case 3:
            return <div className={classReader('column-basic-2 text-center')}>
              <Badge className={classReader('px-3')} color="green" rounded>審核通過</Badge>
            </div>
          default :
            return <div />
          }
        },
      },
    },
    {
      name: 'action',
      label: '編輯',
      options: {
        customHeadLabelRender: (columnMeta) => W && <div className={classReader('text-center')}>{columnMeta.label}</div>,
        customBodyRender: (value, tableMeta) => {
          return W && <div className={classReader('action-column')}>
            <div
              className={classReader('bg-green action-btn')}
              onClick={() => {
                setEditDlgData(value)
                editDlgUseForm.setValue('status', value.status)
              }}
            >
              <i className={classReader('icon icon-edit icon-white')}/>
            </div>
          </div>
        },
      },
    },
  ]

  const handleEdit = async () => {
    try {
      if (editDlgUseForm.getValues('status') === editDlgData.status) {
        return enqueueSnackbar('狀態未變更', { className: classReader('warning bg-warning-light') })
      }
      const params = {
        id: editDlgData.id,
        status: editDlgUseForm.getValues('status'),
        name: editDlgData.name,
        brandDomain: editDlgData.brandDomain,
        brandName: editDlgData.brandName,
      }

      const result = await applicationAPI.edit(params)
      if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })
      enqueueSnackbar('編輯成功', { className: classReader('success bg-success-light') })

      if (editDlgUseForm.getValues('status') === 1) { //infra 設定中
        await router.push(`/permission/brand/create?brandName=${editDlgData.brandName}&brandDomain=${editDlgData.brandDomain}&memberName=${editDlgData.name}&email=${editDlgData.email}`)
      } else tableRef.current.fetchData()
      
    } catch (err) {
      reportError(err)
    } finally {
      setEditDlgData({})
    }
  }

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
        ref={tableRef}
        fetchAPI={applicationAPI.get}
        APIResultFormatter={applicationFormatter}
        tableColumns={tableColumns}
        tagsFromUserClick={tagsFromUserClick}
        searchBarChildren={() => <SearchBarChildren />}
        handleSubmit={searchBarUseForm.handleSubmit}
        reset={searchBarUseForm.reset}
        setValue={searchBarUseForm.setValue}
        getValues={searchBarUseForm.getValues}
      />

      <Modal
        title="審查狀態"
        prompt={Boolean(editDlgData.id)}
        okBtn="確定"
        onOk={handleEdit}
        cancelBtn="取消"
        onCancel={() => {setEditDlgData({})}}
      >
        <div className={classReader('w-100')}>
          <div className={classReader('mb-2')}>
            <div className={classReader('text-title')}>姓名</div>
            <div>{editDlgData.name}</div>
          </div>
          <div className={classReader('mb-4')}>
            <div className={classReader('text-title')}>email</div>
            <div className={classReader('word-break')}>{editDlgData.email}</div>
          </div>
          <div className={classReader('mb-2')}>
            <div className={classReader('text-title')}>審核狀態</div>
          </div>
          <Select
            name="status"
            placeholder="待審查 / inFra 設定中 / 申請駁回 / 審核通過"
            options={[
              {
                label: '待審核',
                value: 0,
              },
              {
                label: 'inFra 設定中',
                value: 1,
              },
              {
                label: '申請駁回',
                value: 2,
              },
              {
                label: '審核通過',
                value: 3,
              },
            ]}
            register={editDlgUseForm.register}
            controllerError={editDlgUseForm.errors?.status?.message}
            onChange={(name, val) => editDlgUseForm.setValue(name, val)}
          />
        </div>
      </Modal>
    </>
  )
}

export default AllUserManagement
AllUserManagement.layout = (page) => <Layout>{page}</Layout>