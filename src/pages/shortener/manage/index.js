import React, {
  memo, useState, useRef, useEffect,
} from 'react'
import Layout from 'common/layout/Layout'
import classReader from 'utils/classReader'
import Head from 'next/head'
import { TAB_TITLE_SUFFIX } from 'config/head'
import shortenerAPI from 'apis/shortener'
import { shortenerFormatter } from 'utils/dataFormatter'
import { useSnackbar } from 'notistack'
import { useRouter } from 'next/router'
import TableWithSearch from 'common/TableWithSearch'
import Link from 'next/link'
import { downloadPNG, downloadSVG } from 'common/QRCode'
import Modal from 'common/Modal'
import Button from 'common/Button'
import { useForm } from 'react-hook-form'
import { USE_FORM_CONFIG } from 'config/config'
import { DEFAULT_FILTER_VALUE } from 'config/shortener'
import Input from 'common/form/Input'
import MultiSelectInput from 'common/form/MultiSelectInput'
import DatePicker from 'common/form/DatePicker'
import Select from 'common/form/Select'
import {
  useCheckPermission,
  lastSegmentOfURL, 
  textCopy, 
} from 'utils/util'
import { useDispatch } from 'react-redux'
import { useError } from 'context/ErrorContext'
import { hookFormValidates } from 'utils/hookFormValidates'
import { selectStep, reset as resetStep } from 'slices/stepperSlice'

const pageCode = '301'
const pageName = '單一短網址'
const headTitle = `${pageName}${TAB_TITLE_SUFFIX}`

const Manage = () => {
  const [tagsFromUserClick, setTagsFromUserClick] = useState([])
  const tableRef = useRef({})
  const [deleteDlgData, setDeleteDlgData] = useState({})
  const [qrCodeDlgData, setQRCodeDlgData] = useState({})
  const [cleanCacheDlgData, setCleanCacheDlgData] = useState({})
  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()
  const { reportError } = useError()
  const dispatch = useDispatch()

  const [
    R,
    W,
    D,
  ] = useCheckPermission(pageCode)

  const {
    register, handleSubmit, setValue, control, reset, getValues, formState: { errors },
  } = useForm({
    ...USE_FORM_CONFIG,
    defaultValues: DEFAULT_FILTER_VALUE,
  })

  const tags = getValues('tags')

  const handleCopy = async (value) => {
    const data = await textCopy(value, '複製短網址Url')
    enqueueSnackbar(data.message, { className: classReader(data.className) })
  }

  const handleReset = () => {
    reset()
    setTagsFromUserClick([])
  }

  const SearchBarChildren = memo( function SearchBarChildren() {
    return <>

      <div className={classReader('col-12 col-sm-6 col-lg-2')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>短網址</div>
          <Input
            className={classReader('w-100')}
            register={register}
            name="code"
            validate={hookFormValidates().code}
            controllerError={errors?.code?.message}
          />
        </div>
      </div>
      
      <div className={classReader('col-12 col-sm-6 col-lg-2')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>標題</div>
          <Input
            name="title"
            register={register}
          />
        </div>
      </div>

      <div className={classReader('col-12 col-sm-6 col-lg-2')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>目標網址</div>
          <Input
            name="destUrl"
            register={register}
          />
        </div>
      </div>

      <div className={classReader('col-12 col-sm-6 col-lg-2')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>建立區間（起）</div>
          <DatePicker
            className={classReader('mb-4')}
            name="createDateStart"
            control={control}
          />
        </div>
      </div>

      <div className={classReader('col-12 col-sm-6 col-lg-2')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>建立區間（訖）</div>
          <DatePicker
            className={classReader('mb-4')}
            name="createDateEnd"
            control={control}
          />
        </div>
      </div>

      <div className={classReader('col-12 col-sm-6 col-lg-2')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>啟用狀態</div>
          <Select
            name="isEnabled"
            options={[
              {
                label: '全部',
                value: '2',
              },
              {
                label: '啟用',
                value: '1',
              },
              {
                label: '停用',
                value: '0',
              },
            ]}
            register={register}
            onChange={(name, val) => setValue(name, val)}
          />
        </div>
      </div>

      <div className={classReader('col-12')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>標籤</div>
          <MultiSelectInput
            name="tags"
            placeholder={'輸入完畢後，按Enter 可新增標籤'}
            control={control}
            getValues={getValues}
            setTagsFromUserClick={setTagsFromUserClick}
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
      name: 'code',
      label: '縮網址代碼',
      options: {
        customBodyRender: (value) => (
          <div className={classReader('column-shortener-code')}>
            <div className={classReader('d-flex align-items-center')} >
              <i className={classReader('icon icon-copy icon-sm icon-gray-6 mr-1 cursor-pointer')}
                onClick={() => handleCopy(value)}
              /> <b>{lastSegmentOfURL(value)}</b>
            </div>
          </div>)
        ,
      },
    },
    {
      name: 'tags',
      label: '標籤',
      options: {
        customHeadLabelRender: (columnMeta) => <div className={classReader('px-1')}>{columnMeta.label}</div>,
        customBodyRender: (value) => <div className={classReader('column-basic-4')}>
          {
            value?.map((item, index) => <small key={index} className={classReader('text-tag', { ShortenerStyle: 'clickable' })} onClick={() => {
              const { tags } = getValues()
              if (!tags.includes(item)) {
                setTagsFromUserClick(prev => prev.includes(item) ? prev : [...prev, item])
                setValue('tags', tags.concat(item))
                handleSubmit()
              }
            }}>{item}</small>)
          }
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
      name: 'action',
      label: '操作',
      options: {
        customHeadLabelRender: (columnMeta) => (W || D) && <div className={classReader('text-center')}>{columnMeta.label}</div>,
        customBodyRender: (value) => (W || D) && (value.expired ? <div className={classReader('gray-6 text-center')}>短網址已到期</div> : (
          <div className={classReader('action-column')}>

            {
              W && <div
                className={classReader('bg-green action-btn')}
                onClick={() => router.push(`/shortener/manage/edit/${value?.id}`)}
              >
                <i className={classReader('icon icon-edit icon-white')}/>
              </div>
            }

            {
              D && <div
                className={classReader('bg-red action-btn')}
                onClick={() => setDeleteDlgData(value)}
              >
                <i className={classReader('icon icon-delete icon-white')} />
              </div>
            }
            
            {(W || D) && <>
              <div
                className={classReader('bg-blue action-btn')}
                onClick={() => setQRCodeDlgData(value)}
              >
                <i className={classReader('icon icon-qr-code icon-white')} />
              </div>

              <div
                className={classReader('bg-gray-6 action-btn')}
                onClick={() => setCleanCacheDlgData(value)}
              >
                <i className={classReader('icon icon-auto-renew icon-white')} />
              </div>
            </>}
            
          </div>
        )),
      },
    },
  ]

  const handleDeleteShortener = async () => {
    try {
      dispatch({ type: 'loading/openLoading' })
      const result = await shortenerAPI.delete({ id: deleteDlgData.id })
      if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })

      enqueueSnackbar('刪除成功', { className: classReader('success bg-success-light') })
      setDeleteDlgData({})
      tableRef?.current?.fetchData()

    } catch (err) {
      reportError(err)
    } finally {
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

  const CreateButton = memo( function CreateButton() {
    return W && <Button
      className={classReader('table-header-btn m-0')}
      color="green"
      label="新增"
      onClick={() => router.push('/shortener/manage/create')}
    />
  })

  useEffect(() => {
    dispatch(resetStep())
  }, [])

  useEffect(() => {
    setValue('tags', tagsFromUserClick)
  }, [tagsFromUserClick])

  return <>
    <Head>
      <title>{headTitle}</title>
    </Head>

    <TableWithSearch
      fetchAPI={shortenerAPI.get}
      APIResultFormatter={shortenerFormatter}
      tableColumns={tableColumns}
      tagsFromUserClick={tagsFromUserClick}
      customToolbar={() => <CreateButton />}
      searchBarChildren={() => <SearchBarChildren />}
      handleSubmit={handleSubmit}
      reset={handleReset}
      setValue={setValue}
      getValues={getValues}
      ref={tableRef}
    />

    <Modal
      prompt={Boolean(deleteDlgData?.title)}
      title="刪除確認"
      okBtn="確定"
      onOk={handleDeleteShortener}
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
          <img width={120} height={120} src="/facebook.svg" className={classReader('m-3')} alt="facebook" />
        </Link>
        <Link href="https://poker.line.naver.jp/" target="_blank">
          <img width={120} height={120} src="/line.svg" className={classReader('m-3')} alt="line" />
        </Link>
      </div>
    </Modal>
  </>
}

export default Manage
Manage.layout = (page) => <Layout>{page}</Layout>