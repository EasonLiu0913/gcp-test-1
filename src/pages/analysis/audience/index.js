import Layout from 'common/layout/Layout'
import classReader from 'utils/classReader'
import React, {
  cache, memo, useState, 
} from 'react'
import Head from 'next/head'
import { TAB_TITLE_SUFFIX } from 'config/head'
import { useForm } from 'react-hook-form'
import { USE_FORM_CONFIG } from 'config/config'
import TableWithSearch from 'common/TableWithSearch'
import { analysisAudienceFormatter } from 'utils/dataFormatter'
import Button from 'common/Button'
import Input from 'common/form/Input'
import DatePicker from 'common/form/DatePicker'
import Select from 'common/form/Select'
import analysisAPI from 'apis/analysis'
import Link from 'next/link'
import { dateFormat } from 'utils/date'
import { hookFormValidates } from 'utils/hookFormValidates'
import { useError } from 'context/ErrorContext'

const pageName = '受眾分析'
const headTitle = `${pageName}${TAB_TITLE_SUFFIX}`

const Audience = () => {
  const [tagsFromUserClick] = useState([])
  const {
    register, handleSubmit, control, reset, setValue, getValues, formState: { errors },
  } = useForm({
    ...USE_FORM_CONFIG,
    defaultValues: {
      endDate: dateFormat('now'),
      pageSize: 10,
      startDate: dateFormat('now', -6),
    },
  })
  const { reportError } = useError()
  const [exchangeStatus, setExchangeStatus] = useState(false)

  const ExportButton = memo(function ExportButton() {
    const exportCSV = async () => {
      setExchangeStatus(true)
      try {
        let params = getValues()
        for (let key in params) {
          if (params[key] === '') delete params[key]
        }
  
        let result = await analysisAPI.exportGaAudience(params)
        const href = URL.createObjectURL(result)
        const link = document.createElement('a')
        link.href = href
        link.setAttribute('download', 'audience.csv')
        document.body.appendChild(link)
        link.click()
  
        document.body.removeChild(link)
        URL.revokeObjectURL(href)
      } catch (err) {
        reportError(err)
      } finally {
        setExchangeStatus(false)
      }
    }

    return <Button
      className={classReader('my-0 mx-2')}
      color="primary"
      label="匯出"
      onClick={exportCSV}
      isLoading={exchangeStatus}
      disabled={exchangeStatus}
    />
  })

  const SearchBarChildren = memo( function SearchBarChildren() {
    return <>
      <div className={classReader('col-12 col-sm-6 col-md-4')}>
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

      <div className={classReader('col-12 col-sm-6 col-md-8')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>目標網址</div>
          <Input
            name="destUrl"
            register={register}
          />
        </div>
      </div>

      <div className={classReader('col-12 col-sm-6 col-md-2')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>utm_source</div>
          <Input
            name="utmSource"
            register={register}
          />
        </div>
      </div>

      <div className={classReader('col-12 col-sm-6 col-md-2')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>utm_medium</div>
          <Input
            name="utmMedium"
            register={register}
          />
        </div>
      </div>

      <div className={classReader('col-12 col-sm-6 col-md-2')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>utm_campaign</div>
          <Input
            name="utmCampaign"
            register={register}
          />
        </div>
      </div>

      <div className={classReader('col-12 col-sm-6 col-md-2')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title text-required')}>點擊區間（起）</div>
          <DatePicker
            className={classReader('mb-4')}
            name="startDate"
            control={control}
            validate={hookFormValidates().expiryStartDate}
          />
        </div>
      </div>

      <div className={classReader('col-12 col-sm-6 col-md-2')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title text-required')}>點擊區間（訖）</div>
          <DatePicker
            className={classReader('mb-4')}
            name="endDate"
            control={control}
            validate={hookFormValidates().expiryEndDate}
          />
        </div>
      </div>

      <div className={classReader('col-12 col-sm-6 col-md-2')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>短網址類別</div>
          <Select
            name="createKind"
            options={[
              {
                label: '單一',
                value: '0',
              },
              {
                label: '量產',
                value: '1',
              },
              {
                label: '1:1個人化',
                value: '2',
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
      name: 'main',
      label: '短網址',
      options: {
        customBodyRender: (value) => <div className={classReader('d-flex column-basic-5')}>
          <div className={classReader('d-flex flex-center mr-2')}>
            <div className={classReader('list-bg-image')} style={{ backgroundImage: `url(${value.imageUrl || '/imageNotFound.svg'})` }}></div>
          </div>
          <div>
            <div className={classReader('bold mb-1 ellipsis')}>{value.title}</div>
            <div className={classReader('text-secondary')}>{value.shortUrl}</div>
          </div>
        </div>,
      },
    },
    {
      name: 'destUrl',
      label: '目標網址',
      options: {
        customBodyRender: (value) => {
          return <div className={classReader('column-basic-5 word-break')}>
            {value}
          </div>
        },
      },
    },
    {
      name: 'createKind',
      label: '短網址類別',
      options: {
        customHeadLabelRender: (columnMeta) => <div className={classReader('text-center')}>{columnMeta.label}</div>,
        customBodyRender: (value) => <div className={classReader('column-basic-3 text-center')}>{value}</div>,
      },
    },
    {
      name: 'totalClick',
      label: '總點擊數',
      options: {
        customHeadLabelRender: (columnMeta) => <div className={classReader('text-right')}>{columnMeta.label}</div>,
        customBodyRender: (value) => {
          // return <Link href={`/analysis/audience/detail/${value.pairInfoId}`}>
          return <div className={classReader('column-basic-2 text-right')}>{value}</div>
          // </Link>
        },
      },
    },
    {
      name: 'uniqueUsers',
      label: '不重複使用者',
      options: {
        customHeadLabelRender: (columnMeta) => <div className={classReader('text-right')}>{columnMeta.label}</div>,
        customBodyRender: (value) => {
          return <div className={classReader('column-basic-3 text-right' )}>{value}</div>
        },
      },
    },
    {
      name: 'action',
      label: '操作',
      options: {
        customHeadLabelRender: (columnMeta) => <div className={classReader('text-center')}>{columnMeta.label}</div>,
        customBodyRender: (value) => {
          return <div className={classReader('action-column')}>
            <Link href={`/analysis/audience/related/${value.id}?uu=${value.uniqueUsers}`}>
              <div className={classReader('bg-secondary action-btn')}>
                <i className={classReader('icon icon-manage-search icon-white')}/>
              </div>
            </Link>

            {value.labelDisabled ? <>
              <div className={classReader('bg-gray-5 action-btn')} title="建立日１周後才有資料!">
                <i className={classReader('icon icon-tag icon-white')} />
              </div>
            </> : <>
              <Link href={`/analysis/audience/label/${value.id}?uu=${value.uniqueUsers}`}>
                <div className={classReader('bg-orange action-btn')}>
                  <i className={classReader('icon icon-tag icon-white')} />
                </div>
              </Link>
            </>}
            
            {/* 
            <div className={classReader('bg-text-secondary action-btn white')}>
              Ad
            </div> */}
          </div>
        },
      },
    },
  ]

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
      fetchAPI={analysisAPI.getGaAudience}
      APIResultFormatter={analysisAudienceFormatter}
      tableColumns={tableColumns}
      tagsFromUserClick={tagsFromUserClick}
      customToolbar={() => <ExportButton />}
      searchBarChildren={() => <SearchBarChildren />}
      handleSubmit={handleSubmit}
      reset={reset}
      setValue={setValue}
      getValues={getValues}
    />
  </>
}

export default Audience
Audience.layout = (page) => <Layout>{page}</Layout>