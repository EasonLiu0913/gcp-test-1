import React, {
  useState, memo, useEffect, useRef, useCallback,
} from 'react'
import Head from 'next/head'
import classReader from 'utils/classReader'
import { handleHeadParams, useCheckPermission } from 'utils/util'
import { thousandthsFormat } from 'utils/valueFormat'
import { TAB_TITLE_SUFFIX } from 'config/head'
import Layout from 'common/layout/Layout'
import shortenerIndividualAPI from 'apis/shortenerIndividual'
import { shortenerOneOnOnFormatter } from 'utils/dataFormatter'
import TableWithSearch from 'common/TableWithSearch'
import { useRouter } from 'next/router'
import Button from 'common/Button'
import Input from 'common/form/Input'
import DatePicker from 'common/form/DatePicker'
import { useForm } from 'react-hook-form'
import { USE_FORM_CONFIG } from 'config/config'
import { useError } from 'context/ErrorContext'
import Modal from 'common/Modal'
import Image from 'next/image'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { downloadPNG, downloadSVG } from 'src/common/QRCode'
import { useSnackbar } from 'notistack'
import MultiSelectInput from 'common/form/MultiSelectInput'
import { selectStep, reset as resetStep } from 'slices/stepperSlice'
import { selectUser } from 'slices/userSlice'

export async function getServerSideProps(context) {
  const headParams = handleHeadParams(context)
  return { props: { ...headParams } }
}

const pageCode = '304'
const pageName = '1:1自定義參數短網址'
const headTitle = `${pageName}${TAB_TITLE_SUFFIX}`
const createType = 'Parameter'

const Parameters = () => {
  const [tagsFromUserClick] = useState([])
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  console.log('Parameters ~ user:', user)
  const { enqueueSnackbar } = useSnackbar()
  const [
    R,
    W,
    D,
  ] = useCheckPermission(pageCode)
  const { reportError } = useError()
  const [deleteDlgData, setDeleteDlgData] = useState({})
  const [deleteDlgPrompt, setDeleteDlgPrompt] = useState(false)
  const [autoDownloadPrompt, setAutoDownloadPrompt] = useState(false)
  const [codeListPrompt, setCodeListPrompt] = useState(false)
  const [codeList, setCodeList] = useState([])
  const tableRef = useRef('')
  const {
    register, handleSubmit, control, reset, setValue, getValues,
  } = useForm({
    ...USE_FORM_CONFIG,
    defaultValues: {
      campaignName: '',
      campaignStartDate: '',
      pageSize: 10,
      searchStartDate: '',
      searchEndDate: '',
    },
  })

  const SearchBarChildren = memo(function SearchBarChildren() {
    return <>
      <div className={classReader('col-12 col-sm-6 col-md-3')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>行銷活動名稱</div>
          <Input
            className={classReader('w-100')}
            name="campaignName"
            register={register}
          />
        </div>
      </div>

      <div className={classReader('col-12 col-sm-6 col-md-3')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>資料記錄起日（連續紀錄15天）</div>
          <DatePicker
            className={classReader('mb-4')}
            name="campaignStartDate"
            control={control}
          />
        </div>
      </div>

      <div className={classReader('col-12 col-sm-6 col-md-3')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>建立時間（起）</div>
          <DatePicker
            className={classReader('mb-4')}
            name="searchStartDate"
            control={control}
          />
        </div>
      </div>

      <div className={classReader('col-12 col-sm-6 col-md-3')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>建立時間（訖）</div>
          <DatePicker
            className={classReader('mb-4')}
            name="searchEndDate"
            control={control}
          />
        </div>
      </div>

      {/* <div className={classReader('col-12')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>標籤</div>
          <MultiSelectInput
            name="tags"
            placeholder={'輸入完畢後，按Enter 可新增標籤'}
            control={control}
          />
        </div>
      </div> */}
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
      name: 'code',
      label: '活動名稱',
      options: {
        customBodyRender: (value) => <div className={classReader('bold')}>
          {value}
        </div>,
      },
    },
    {
      name: 'main',
      label: '標題 / 目標網址',
      options: {
        customBodyRender: (value) => (
          <div className={classReader('column-shortener-main')}>
            <div className={classReader('bold text-lg ellipsis')}>{value?.title}</div>
            <Link href={value?.destUrl ?? ''} title={value?.destUrl} target="_blank">
              <div className={classReader('d-block text-sm ellipsis primary')}>
                {value?.destUrl}
              </div>
            </Link>
          </div>)
        ,
      },
    },
    {
      name: 'expiryDate',
      label: '上線日期',
      options: {
        customHeadLabelRender: (columnMeta ) => <div className={classReader('text-center')}>{columnMeta.label}</div>,
        customBodyRender: (value) => <div
          className={classReader('text-center column-date')}>
          <div>{value?.start}</div>
          <div>{value?.end}</div>
        </div>,
      },
    },
    {
      name: 'createUserName',
      label: '建立人員',
      options: {
        customBodyRender: (value) => <div
          className={classReader('column-basic-2')}>
          <div>{value}</div>
        </div>,
      },
    },
    {
      name: 'quantity',
      label: '名單數量',
      options: {
        customHeadLabelRender: (columnMeta) => <div className={classReader('text-right')}>{columnMeta.label}</div>,
        customBodyRender: (value, tableMeta) => <div
          className={classReader('text-right bold column-basic-3 cursor-pointer')}
          onClick={() => {
            console.log('tableMeta.rowData', tableMeta.rowData)
            handleCodeListPrompt(tableMeta.rowData[tableMeta.rowData.length - 1].id)
          }}
        >
          {thousandthsFormat(value)}
        </div>,
      },
    },
    {
      name: 'action',
      label: '操作區',
      options: {
        customHeadLabelRender: (columnMeta ) => (W || D) && <div className={classReader('text-center')}>{columnMeta.label}</div>,
        customBodyRender: (value) => {
          // const disabled = value.createUserId !== user.id
          return (W || D) && <div className={classReader('action-column')}>
            {
              W && <div
                className={classReader('bg-green action-btn')}
                onClick={() => {
                  // if (value.isDownload) {
                  router.push(`/shortener/parameters/edit/${value?.id}`)
                  // } else {
                  //   reportError({
                  //     errorNo: -1,
                  //     message: '請先點選"下載"進行備存', 
                  //   })
                  // }
                }}
              >
                <i className={classReader('icon icon-edit icon-white')}/>
              </div>
            }

            {
              D && <div
                className={classReader('bg-red action-btn')}
                onClick={async () => {
                  // if (!disabled){
                  setDeleteDlgData(value)
                  setAutoDownloadPrompt(true)
                  // }
                  // if (value.isDownload) {
                  //   setDeleteDlgData(value)
                  // } else {
                  //   reportError({
                  //     errorNo: -1,
                  //     message: '請先點選"下載"進行備存', 
                  //   })
                  // }
                }}
              >
                <i className={classReader('icon icon-delete icon-white')} />
              </div>
            }

            <div
              className={classReader('bg-secondary action-btn')}
              onClick={() => exportCSV(
                value.id, value.campaignName, value.isDownload, 
              )}
            >
              <i className={classReader('icon icon-download icon-white')} />
            </div>
          </div>
        },
      },
    },
  ]

  const handleDeleteShortener = async () => {
    dispatch({ type: 'loading/openLoading' })
    try {
      const result = await shortenerIndividualAPI.delete({ id: deleteDlgData.id })
      if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })

      enqueueSnackbar('刪除成功', { className: classReader('success bg-success-light') })
      tableRef.current.fetchData()
    } catch (err) {
      reportError(err)
    } finally {
      setDeleteDlgPrompt(false)
      setDeleteDlgData({})
      dispatch({ type: 'loading/closeLoading' })
    }
  }

  const exportCSV = async (
    id, campaignName, isDownload, isDeleteDlgPrompt = false,
  ) => {
    try {
      dispatch({ type: 'loading/openLoading' })
      const result = await shortenerIndividualAPI.export({ 
        id, 
        createType,
      })
    
      const href = URL.createObjectURL(result)
      const link = document.createElement('a')
      link.href = href
      link.setAttribute('download', campaignName + '.zip')
      document.body.appendChild(link)
      link.click()
      
      document.body.removeChild(link)
      URL.revokeObjectURL(href)

      if (!isDownload) {
        const updateTableData = tableRef.current.data.map(item => {
          if (item.id === id) {
            return {
              ...item,
              action: {
                ...item.action,
                isDownload: true, 
              }, 
            }
          }
          return item
        })
        tableRef.current.setData(updateTableData)
      }
      
      if (isDeleteDlgPrompt) {
        dispatch({ type: 'loading/closeLoading' })
        setAutoDownloadPrompt(false)
        setDeleteDlgPrompt(true)
      }
    } catch (err) {
      reportError(err)
    } finally {
      dispatch({ type: 'loading/closeLoading' })
      setAutoDownloadPrompt(false)
    }
  }

  const handleCodeListPrompt = async (id) => {
    dispatch({ type: 'loading/openLoading' })
    try {
      const result = await shortenerIndividualAPI.getInfo({ id })
      const { data, success } = result
      if (!success) return reportError({ errorNo: result.errorNo || 9999 })

      const urlPrefix = `https://${user.defaultProjectBrandDomain}/${data.pairInfo.code}/`
      setCodeList(data.parameters.map(item => `${urlPrefix}${item}`))
    } catch (err) {
      reportError(err)
      router.replace('/shortener/parameters')
    } finally {
      dispatch({ type: 'loading/closeLoading' })
      setCodeListPrompt(true)
    }
  }

  const CreateButton = memo(function CreateButton() {
    const router = useRouter()

    return W && <Button
      className={classReader('table-header-btn m-0')}
      color="green"
      label="新增"
      onClick={() => router.push('/shortener/parameters/create')}
    />
  })

  const fetchList = useCallback((params) => {
    return shortenerIndividualAPI.getList({
      ...params, 
      createType: 'Parameter',
    })
  }, [])
  
  useEffect(() => {
    dispatch(resetStep())
  }, [])

  return <>
    <Head>
      <title>{headTitle}</title>
    </Head>

    <TableWithSearch
      fetchAPI={fetchList}
      APIResultFormatter={shortenerOneOnOnFormatter}
      tableColumns={tableColumns}
      tagsFromUserClick={tagsFromUserClick}
      customToolbar={() => <CreateButton />}
      searchBarChildren={() => <SearchBarChildren />}
      handleSubmit={handleSubmit}
      reset={reset}
      setValue={setValue}
      getValues={getValues}
      ref={tableRef}
      createType={createType}
    />

    <Modal
      prompt={autoDownloadPrompt}
      title="請先備份資料"
      okBtn="下載"
      onOk={() => exportCSV(
        deleteDlgData.id, deleteDlgData.campaignName, deleteDlgData.isDownload, true,
      )}
      cancelBtn="取消"
      onCancel={() => setAutoDownloadPrompt(false)}
      onClose={() => setAutoDownloadPrompt(false)}
      close
    >
      <p className={classReader('text-center')}>點擊下載開始備份</p>
    </Modal>

    <Modal
      prompt={deleteDlgPrompt && !!deleteDlgData?.title}
      title="刪除確認"
      okBtn="確定"
      onOk={() => handleDeleteShortener()}
      cancelBtn="取消"
      onCancel={() => setDeleteDlgPrompt(false)}
      onClose={() => setDeleteDlgPrompt(false)}
      close
    >
      <p className={classReader('text-center')}>您確定要刪除 {deleteDlgData?.title}？</p>
    </Modal>

    <Modal
      prompt={codeListPrompt}
      title="活動名單一覽 (可點擊複製網址)"
      onClose={() => setCodeListPrompt(false)}
      close
    >
      <div 
        className={classReader(
          'd-flex flex-column flex-start', { ShortenerStyle: 'code-list' }, { ShortenerStyle: { 'code-list--100': codeList.length > 12 || codeList.some(code => code.length >= 46) } },
        )}
      >
        {codeList.map((item, index) => <div 
          className={classReader('cursor-pointer', { ShortenerStyle: 'url-preview' })} 
          key={index} 
          onClick={() => {
            navigator.clipboard.writeText(item)
            alert('已複製網址')
          }}
        >
          {item}
        </div>)}
      </div>
    </Modal>
  </>
}

export default Parameters
Parameters.layout = (page) => <Layout>{page}</Layout>
