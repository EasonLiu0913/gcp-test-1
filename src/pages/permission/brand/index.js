import React, {
  memo, useState, useRef, 
} from 'react'
import Head from 'next/head'
import classReader from 'utils/classReader'
import { handleHeadParams, useCheckPermission } from 'utils/util'
import { thousandthsFormat } from 'utils/valueFormat'
import { TAB_TITLE_SUFFIX } from 'config/head'
import { BREADCRUMBS_OPTION } from 'config/breadcrumbs'
import Breadcrumbs from 'common/Breadcrumbs'
import Layout from 'common/layout/Layout'
import projectAPI from 'apis/project'
import { brandFormatter } from 'utils/dataFormatter'
import TableWithSearch from 'common/TableWithSearch'
import Badge from 'common/Badge'
import Button from 'common/Button'
import Input from 'common/form/Input'
import Select from 'common/form/Select'
import { useForm } from 'react-hook-form'
import { USE_FORM_CONFIG } from 'config/config'
import { useRouter } from 'next/router'
import Modal from 'common/Modal'
import { useSnackbar } from 'notistack'
import { useError } from 'context/ErrorContext'
import { DEFAULT_DELETE_DLG_DATA } from 'config/permission/brand'

// 預留 SSR 區塊
export async function getServerSideProps(context) {
  const headParams = handleHeadParams(context)
  return { props: { ...headParams } }
}

const pageCode = '203'
const pageName = '品牌網域管理'
const headTitle = `${pageName}${TAB_TITLE_SUFFIX}`

const Brand = () => {
  const [tagsFromUserClick] = useState([]) 
  const tableRef = useRef(null)
  const { enqueueSnackbar } = useSnackbar()
  const [deleteDlgData, setDeleteDlgData] = useState(DEFAULT_DELETE_DLG_DATA)
  const router = useRouter()
  const [
    R,
    W,
    D,
  ] = useCheckPermission(pageCode)
  const { reportError } = useError()
  const {
    register, handleSubmit, reset, setValue, getValues,
  } = useForm({
    ...USE_FORM_CONFIG,
    defaultValues: {
      brandName: '',
      brandDomain: '',
      isEnabled: 'all',
      pageSize: 10,
    },
  })

  const SearchBarChildren = memo( function SearchBarChildren() {
    return <>
      <div className={classReader('col-12 col-md-4')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>品牌</div>
          <Input
            name="brandName"
            register={register}
          />
        </div>
      </div>

      <div className={classReader('col-12 col-md-5')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>網域</div>
          <Input
            name="brandDomain"
            register={register}
          />
        </div>
      </div>

      <div className={classReader('col-12 col-md-3')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>啟用狀態</div>
          <Select
            name="isEnabled"
            options={[
              {
                label: '全部',
                value: 'all',
              },
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
      name: 'brandName',
      label: '品牌名稱',
      options: {
        customBodyRender: (value) => <div className={classReader('column-basic-4')}>
          {value}
        </div>,
      },
    },
    {
      name: 'brandDomain',
      label: '品牌網域',
      options: {
        customBodyRender: (value) => <div className={classReader('column-basic-5 word-break')}>
          {value}
        </div>,
      },
    },
    {
      name: 'createDate',
      label: '建立時間',
      options: {
        customHeadLabelRender: (columnMeta) => <div className={classReader('text-center')}>{columnMeta.label}</div>,
        customBodyRender: (value) => <div
          className={classReader('column-date text-center')}>
          {value}
        </div>,
      },
    },
    {
      name: 'memberCount',
      label: '品牌人數',
      options: {
        customHeadLabelRender: (columnMeta) => <div className={classReader('text-right')}>{columnMeta.label}</div>,
        customBodyRender: (value) => <div
          className={classReader('text-right column-basic-2')}>
          {thousandthsFormat(value)}
        </div>,
      },
    },
    {
      name: 'isEnabled',
      label: '啟用狀態',
      options: {
        customHeadLabelRender: (columnMeta) => <div className={classReader('text-center')}>{columnMeta.label}</div>,
        customBodyRender: value => {
          if (value) {
            return <div className={classReader('column-basic-2 text-center')}>
              <Badge className={classReader('px-3')} color="green" rounded>啟用</Badge>
            </div>
          } else {
            return <div className={classReader('column-basic-2 text-center')}>
              <Badge className={classReader('px-3')} color="gray-6" rounded>停用</Badge>
            </div>
          }
        },
      },
    },
    {
      name: 'action',
      label: '操作',
      options: {
        customHeadLabelRender: (columnMeta) => W && <div className={classReader('text-center')}>{columnMeta.label}</div>,
        customBodyRender: (value) => W && (
          <div className={classReader('action-column')}>
            <div
              className={classReader('bg-green action-btn')}
              onClick={() => router.push(`/permission/brand/edit/${value.id}`)}
            >
              <i className={classReader('icon icon-edit icon-white')}/>
            </div>

            {D && (
              <div
                className={classReader('bg-red action-btn')}
                onClick={() => {
                  setDeleteDlgData({
                    id: value.id,
                    brandName: value.brandName,
                    status: true,
                  })
                }}
              >
                <i className={classReader('icon icon-delete icon-white')}/>
              </div>
            )}
          </div>
        ),
      },
    },
  ]

  const handleDelete = async () => {
    try {
      const result = await projectAPI.deleteBrandDomain({ id: deleteDlgData.id })
      if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })
      enqueueSnackbar('刪除成功', { className: classReader('success bg-success-light') })
      tableRef.current.fetchData()
    } catch (err) {
      reportError(err)
    } finally {
      setDeleteDlgData(DEFAULT_DELETE_DLG_DATA)
    }
  }
  
  const CreateButton = memo(function CreateButton() {
    if (W) {
      return <Button
        className={classReader('table-header-btn m-0')}
        color="green"
        label="新增"
        onClick={() => router.push('/permission/brand/create')}
      />
    } else {
      return null
    }
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
        ref={tableRef}
        fetchAPI={projectAPI.getBrandDomain}
        APIResultFormatter={brandFormatter}
        tableColumns={tableColumns}
        tagsFromUserClick={tagsFromUserClick}
        customToolbar={() => <CreateButton />}
        searchBarChildren={() => <SearchBarChildren />}
        handleSubmit={handleSubmit}
        reset={reset}
        setValue={setValue}
        getValues={getValues}/>

      <Modal
        prompt={Boolean(deleteDlgData.status)}
        title="確認刪除"
        okBtn="確定"
        onOk={() => handleDelete()}
        cancelBtn="取消"
        onCancel={() => setDeleteDlgData(DEFAULT_DELETE_DLG_DATA)}
      >
        <div className={classReader('text-center')}>您確定要刪除{deleteDlgData.brandName}?</div>
      </Modal>
    </>
  )
}

export default Brand
Brand.layout = (page) => <Layout>{page}</Layout>