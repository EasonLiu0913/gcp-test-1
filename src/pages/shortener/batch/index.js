import Layout from 'common/layout/Layout'
import classReader from 'utils/classReader'
import React, {
  memo, useState, useRef, useEffect,
} from 'react'
import Head from 'next/head'
import { TAB_TITLE_SUFFIX } from 'config/head'
import shortenerBatchAPI from 'apis/shortenerBatch'
import { shortenerBatchFormatter } from 'utils/dataFormatter'
import { useSnackbar } from 'notistack'
import TableWithSearch from 'common/TableWithSearch'
import { useRouter } from 'next/router'
import { useCheckPermission } from 'utils/util'
import { thousandthsFormat } from 'utils/valueFormat'
import Button from 'common/Button'
import Modal from 'common/Modal'
import Input from 'common/form/Input'
import DatePicker from 'common/form/DatePicker'
import { useForm } from 'react-hook-form'
import { USE_FORM_CONFIG } from 'config/config'
import { useError } from 'context/ErrorContext'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import { selectStep, reset as resetStep } from 'slices/stepperSlice'

const pageCode = '302'
const pageName = '量產短網址'
const headTitle = `${pageName}${TAB_TITLE_SUFFIX}`

//測讀下載csv

const ShortenerBatch = () => {
  const [tagsFromUserClick] = useState([])
  const [deleteDlgData, setDeleteDlgData] = useState({})
  const tableRef = useRef(null)
  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()
  const dispatch = useDispatch()
  const [
    R,
    W,
    D,
  ] = useCheckPermission(pageCode)
  const { reportError } = useError()

  const {
    register, handleSubmit, control, reset, setValue, getValues,
  } = useForm({
    ...USE_FORM_CONFIG,
    defaultValues: {
      batchName: '',
      createDateStart: '',
      createDateEnd: '',
      pageSize: 10,
    },
  })

  const SearchBarChildren = memo(function SearchBarChildren() {
    return <>
      <div className={classReader('col-12 col-sm-6 col-md-4')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>檔案名稱</div>
          <Input
            className={classReader('w-100')}
            name="batchName"
            register={register}
          />
        </div>
      </div>

      <div className={classReader('col-12 col-sm-6 col-md-4')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>建立時間（起）</div>
          <DatePicker
            className={classReader('mb-4')}
            name="createDateStart"
            control={control}
          />
        </div>
      </div>

      <div className={classReader('col-12 col-sm-6 col-md-4')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>建立時間（訖）</div>
          <DatePicker
            className={classReader('mb-4')}
            name="createDateEnd"
            control={control}
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
        customBodyRender: (value) => <div
          className={classReader('text-center column-index')}>
          {value}
        </div>,
      },
    },
    {
      name: 'batchName',
      label: '檔案名稱',
      options: {
        customBodyRender: (value) => <div className={classReader('bold column-basic-3')}>
          {value}
        </div>,
      },
    },
    {
      name: 'batchQuantity',
      label: '量產短網址數量',
      options: {
        customHeadLabelRender: (columnMeta) => <div className={classReader('text-right')}>{columnMeta.label}</div>,
        customBodyRender: (value) => <div
          className={classReader('text-right bold column-basic-3')}>
          {thousandthsFormat(value)}
        </div>,
      },
    },
    {
      name: 'createDate',
      label: '建立日期',
      options: {
        customHeadLabelRender: (columnMeta) => <div className={classReader('text-center')}>{columnMeta.label}</div>,
        customBodyRender: (value) => <div
          className={classReader('text-center column-date')}>
          {value}
        </div>,
      },
    },
    {
      name: 'createUser',
      label: '建立人員',
      options: {
        customHeadLabelRender: (columnMeta) => <div className={classReader('text-center')}>{columnMeta.label}</div>,
        customBodyRender: (value) => <div className={classReader('text-center column-basic-3')}>
          <div className={classReader('text-center bold')}>{value}</div>
        </div>,
      },
    },
    {
      name: 'action',
      label: '操作',
      options: {
        customHeadLabelRender: (columnMeta) => <div className={classReader('text-center')}>{columnMeta.label}</div>,
        customBodyRender: (value) => {
          return <div className={classReader('action-column')}>
            {(W || D) &&
              <div
                className={classReader('bg-secondary action-btn')}
                onClick={() => exportCSV(value.id, value.batchName)}
              >
                <i className={classReader('icon icon-download icon-white')} />
              </div>
            }

            <div
              className={classReader('bg-blue action-btn')}
            >
              <Link className={classReader('primary')} href={`/shortener/batch/list/${value.id}`}>
                <i className={classReader('icon icon-list-alt icon-white')} />
              </Link>
              
            </div>

            {D && (
              <div
                className={classReader('bg-red action-btn')}
                onClick={() => setDeleteDlgData(value)}
              >
                <i className={classReader('icon icon-delete icon-white')}/>
              </div>
            )}
          </div>
        },
      },
    },
  ]

  const handleDelete = async () => {
    dispatch({ type: 'loading/openLoading' })
    try {
      const result = await shortenerBatchAPI.delete({ id: deleteDlgData.id })
      if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })

      enqueueSnackbar('刪除成功', { className: classReader('success bg-success-light') })
      setDeleteDlgData({})
      tableRef.current.fetchData()

    } catch (err) {
      reportError(err)
    } finally {
      dispatch({ type: 'loading/closeLoading' })
    }
  }

  const exportCSV = async (id, campaignName) => {
    dispatch({ type: 'loading/openLoading' })
    try {
      const result = await shortenerBatchAPI.export({ id: id })
      const href = URL.createObjectURL(result)
      const link = document.createElement('a')
      link.href = href
      link.setAttribute('download', campaignName + '.csv')
      document.body.appendChild(link)
      link.click()
    
      document.body.removeChild(link)
      URL.revokeObjectURL(href)
   
    } catch (err) {
      reportError(err)
    } finally {
      dispatch({ type: 'loading/closeLoading' })
    }
  }

  const CreateButton = memo(function CreateButton() {
    return W && <Button
      className={classReader('table-header-btn m-0')}
      color="green"
      label="新增"
      onClick={() => router.push('/shortener/batch/create')}
    />
  })

  useEffect(() => {
    dispatch(resetStep())
  }, [])
  
  return <>
    <Head>
      <title>{headTitle}</title>
    </Head>

    {/* <div className={classReader('mb-4')}>
      <Breadcrumbs
        title={pageName}
        options={BREADCRUMBS_OPTION}
      />
    </div> */}

    <TableWithSearch
      ref={tableRef}
      fetchAPI={shortenerBatchAPI.get}
      APIResultFormatter={shortenerBatchFormatter}
      tableColumns={tableColumns}
      tagsFromUserClick={tagsFromUserClick}
      customToolbar={() => <CreateButton />}
      searchBarChildren={() => <SearchBarChildren />}
      handleSubmit={handleSubmit}
      reset={reset}
      setValue={setValue}
      getValues={getValues}
    />

    <Modal
      prompt={Boolean(deleteDlgData?.id)}
      title="刪除確認"
      okBtn="確定"
      onOk={handleDelete}
      cancelBtn="取消"
      onCancel={() => setDeleteDlgData({})}
      onClose={() => setDeleteDlgData({})}
      close
    >
      <p className={classReader('text-center')}>您確定要刪除 {deleteDlgData.batchName}？</p>
    </Modal>
  </>
}

export default ShortenerBatch
ShortenerBatch.layout = (page) => <Layout>{page}</Layout>