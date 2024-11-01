import React, {
  useState, memo, useEffect, useRef,
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

const pageCode = '303'
const pageName = '1:1個人化短網址'
const headTitle = `${pageName}${TAB_TITLE_SUFFIX}`

const OneOnOne = () => {
  const [tagsFromUserClick] = useState([])
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const { enqueueSnackbar } = useSnackbar()
  const [
    R,
    W,
    D,
  ] = useCheckPermission(pageCode)
  const { reportError } = useError()
  const [deleteDlgData, setDeleteDlgData] = useState({})
  const [qrCodeDlgData, setQRCodeDlgData] = useState({})
  const [cleanCacheDlgData, setCleanCacheDlgData] = useState({})
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
      name: 'campaignName',
      label: '行銷活動名稱',
      options: {
        customBodyRender: (value) => <div className={classReader('bold column-basic-3')}>
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
      name: 'campaignStartDate',
      label: '資料記錄起日',
      options: {
        customHeadLabelRender: (columnMeta) => <div className={classReader('text-center')}>{columnMeta.label}</div>,
        customBodyRender: (value) => <div
          className={classReader('text-center column-basic-3')}>
          {value}
        </div>,
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
        customBodyRender: (value) => <div
          className={classReader('text-right bold column-basic-3')}>
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
          const disabled = value.createUserId !== user.id
          return (W || D) && <div className={classReader('action-column')}>

            {
              W && !value.isStart && <div
                className={classReader('bg-green action-btn')}
                onClick={() => {
                  if (value.isDownload) {
                    router.push(`/shortener/one-on-one/edit/${value?.id}`)
                  } else {
                    reportError({
                      errorNo: -1,
                      message: '請先點選"下載"進行備存', 
                    })
                  }
                }}
              >
                <i className={classReader('icon icon-edit icon-white')}/>
              </div>
            }

            {
              D && !value.isStart && <div
                className={classReader('bg-red action-btn')}
                onClick={() => {
                  if (value.isDownload) {
                    setDeleteDlgData(value)
                  } else {
                    reportError({
                      errorNo: -1,
                      message: '請先點選"下載"進行備存', 
                    })
                  }
                } }
              >
                <i className={classReader('icon icon-delete icon-white')} />
              </div>
            }

            {/* 
            <div
              className={classReader('bg-blue action-btn')}
              onClick={() => setQRCodeDlgData(value)}
            >
              <i className={classReader('icon icon-qr-code icon-white')} />
            </div> */}

            <div
              className={classReader(`bg-${disabled ? 'gray-5' : 'secondary'} action-btn`)}
              disabled={disabled}
              title={disabled ? '個資保護中，請聯繫建立人員' : ''}
              onClick={() => disabled ? {} : exportCSV(
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
      setDeleteDlgData({})
      dispatch({ type: 'loading/closeLoading' })
    }
  }
  
  const handleDownloadPNG = () => {
    try {
      downloadPNG(qrCodeDlgData.shortenerUrl)
    } catch {
      reportError({ message: '生成PNG檔失敗' })
    }
  }

  const handleDownloadSVG = () => {
    try {
      downloadSVG(qrCodeDlgData.shortenerUrl)
    } catch {
      reportError({ message: '生成SVG檔失敗' })
    }
  }

  const exportCSV = async (
    id, campaignName, isDownload,
  ) => {
    try {
      dispatch({ type: 'loading/openLoading' })
      const result = await shortenerIndividualAPI.export({ id })

      const href = URL.createObjectURL(result)
      const link = document.createElement('a')
      link.href = href
      link.setAttribute('download', campaignName + '.zip')
      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      URL.revokeObjectURL(href)

      if (!isDownload) {
        let tableData = tableRef.current.data
        const infoResult = await shortenerIndividualAPI.getInfo({ id: id })

        if (!infoResult.success) return 
        const { data } = infoResult
        for (let i = 0 ; i < tableData.length ; i++) {
          if (data.id === tableData[i].id) {
            tableData[i].action.isDownload = data.isDownload
            break
          }
        }
        tableRef.current.setData(tableData)
      }

    } catch (err) {
      reportError(err)
    } finally {
      dispatch({ type: 'loading/closeLoading' })
    }
  }

  const CreateButton = memo(function CreateButton() {
    const router = useRouter()

    return W && <Button
      className={classReader('table-header-btn m-0')}
      color="green"
      label="新增"
      onClick={() => router.push('/shortener/one-on-one/create')}
    />
  })
  
  useEffect(() => {
    dispatch(resetStep())
  }, [])

  return <>
    <Head>
      <title>{headTitle}</title>
    </Head>

    <TableWithSearch
      fetchAPI={shortenerIndividualAPI.getList}
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
    />

    <Modal
      prompt={Boolean(deleteDlgData?.title)}
      title="刪除確認"
      okBtn="確定"
      onOk={() => handleDeleteShortener()}
      cancelBtn="取消"
      onCancel={() => setDeleteDlgData({})}
      onClose={() => setDeleteDlgData({})}
      close
    >
      <p className={classReader('text-center')}>您確定要刪除 {deleteDlgData.title}？</p>
    </Modal>

    <Modal
      prompt={Boolean(qrCodeDlgData?.shortenerUrl)}
      title="下載QR Code"
      onClose={() => setQRCodeDlgData({})}
      close
    >
      <div>
        <p>請選擇下載格式：</p>
        <Button label=".png" outline className={classReader('ml-0')} onClick={handleDownloadPNG}/>
        <Button label=".svg" outline onClick={handleDownloadSVG}/>
      </div>
    </Modal>

    <Modal
      prompt={Boolean(cleanCacheDlgData?.shortenerUrl)}
      title="前往清除快取"
      onClose={() => setCleanCacheDlgData({})}
      close
    >
      <p>請點擊Logo 前往相關社群平台，手動進行快取清除</p>
      <div className={classReader('d-flex flex-center')}>
        <Link href={`https://developers.facebook.com/tools/debug/?q=${cleanCacheDlgData?.shortenerUrl}`} target="_blank">
          <img width={120} height={120} src="/facebook.svg" className={classReader('m-3')} alt="facebook"/>
        </Link>
        <Link href="https://poker.line.naver.jp/" target="_blank">
          <img width={120} height={120} src="/line.svg" className={classReader('m-3')} alt="line"/>
        </Link>
      </div>
    </Modal>
  </>
}

export default OneOnOne
OneOnOne.layout = (page) => <Layout>{page}</Layout>