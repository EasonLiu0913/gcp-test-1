import Layout from 'common/layout/Layout'
import classReader from 'utils/classReader'
import React, {
  useState, memo, useRef,
} from 'react'
import Head from 'next/head'
import { TAB_TITLE_SUFFIX } from 'config/head'
import { useForm } from 'react-hook-form'
import { USE_FORM_CONFIG } from 'config/config'
import TableWithSearch from 'common/TableWithSearch'
import { analysisEffectFormatter } from 'utils/dataFormatter'
import Link from 'next/link'
import Button from 'common/Button'
import Input from 'common/form/Input'
import DatePicker from 'common/form/DatePicker'
import Select from 'common/form/Select'
import { rules } from 'utils/validation'
import analysisAPI from 'apis/analysis'
import { FORM_VALIDATES_MSG } from 'config/formValidates'
import { useError } from 'context/ErrorContext'
import { hookFormValidates } from 'utils/hookFormValidates'
import { dateFormat } from 'utils/date'
import MultiSelectInput from 'common/form/MultiSelectInput'

const pageName = '成效分析'
const headTitle = `${pageName}${TAB_TITLE_SUFFIX}`

const Effect = () => {
  const [tagsFromUserClick, setTagsFromUserClick] = useState([])
  const { reportError } = useError()
  const tableRef = useRef('')
  const [tableData, setTableData] = useState([])
  const [exchangeStatus, setExchangeStatus] = useState(false)
  const FORM_VALIDATES = { atLeastOne: { required: (val) => validateInputs() || FORM_VALIDATES_MSG.atLeastOne } }
  const {
    register, handleSubmit, control, reset, setValue, getValues, formState: { errors },
  } = useForm({
    ...USE_FORM_CONFIG,
    defaultValues: {
      endDate: dateFormat('now', 'end'),
      pageSize: 10,
      startDate: dateFormat('now', -6),
      tags: [],
    },
  })

  const tags = getValues('tags')

  const handleReset = () => {
    reset()
    setTagsFromUserClick([])
  }

  const validateInputs = () => {
    return [
      rules.required(getValues('code')),
      rules.required(getValues('title')),
      rules.required(getValues('startDate')),
      rules.required(getValues('endDate')),
      rules.required(getValues('destUrl')),
    ].includes(true)
  }

  const ExportButton = memo(function ExportButton() {
    const exportCSV = async () => {
      setExchangeStatus(true)
      try {
        let params = getValues()
        for (let key in params) {
          if (params[key] === '') delete params[key]
        }
  
        const result = await analysisAPI.exportEffect(params)
        const href = URL.createObjectURL(result)
        const link = document.createElement('a')
        link.href = href
        link.setAttribute('download', 'effect.csv')
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
      label={'匯出'}
      onClick={exportCSV}
      isLoading={exchangeStatus}
      disabled={exchangeStatus}
    />
  })

  const SearchBarChildren = memo( function SearchBarChildren() {
    return <>
      <div className={classReader('col-12 col-sm-6 col-lg-4')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>短網址</div>
          <Input
            className={classReader('w-100')}
            register={register}
            name="code"
            validate={hookFormValidates().code && FORM_VALIDATES.atLeastOne}
            controllerError={errors?.code?.message}
          />
        </div>
      </div>
      
      <div className={classReader('col-12 col-sm-6 col-lg-4')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>標題</div>
          <Input
            name="title"
            register={register}
            validate={FORM_VALIDATES.atLeastOne}
            controllerError={errors?.code?.message}
          />
        </div>
      </div>

      <div className={classReader('col-12 col-sm-6 col-lg-2')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>建立區間（起）</div>
          <DatePicker
            className={classReader('mb-4')}
            name="startDate"
            control={control}
            validate={FORM_VALIDATES.atLeastOne}
            isClearable
          />
        </div>
      </div>

      <div className={classReader('col-12 col-sm-6 col-lg-2')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>建立區間（訖）</div>
          <DatePicker
            className={classReader('mb-4')}
            name="endDate"
            control={control}
            validate={FORM_VALIDATES.atLeastOne}
          />
        </div>
      </div>

      <div className={classReader('col-12 col-sm-6 col-lg-4')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>目標網址</div>
          <Input
            name="destUrl"
            register={register}
            validate={FORM_VALIDATES.atLeastOne}
            controllerError={errors?.code?.message}
          />
        </div>
      </div>



      <div className={classReader('col-12 col-sm-6 col-lg-2')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>utm_source</div>
          <Input
            name="utmSource"
            register={register}
          />
        </div>
      </div>

      <div className={classReader('col-12 col-sm-6 col-lg-2')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>utm_medium</div>
          <Input
            name="utmMedium"
            register={register}
          />
        </div>
      </div>

      <div className={classReader('col-12 col-sm-6 col-lg-2')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>utm_campaign</div>
          <Input
            name="utmCampaign"
            register={register}
          />
        </div>
      </div>
      
      <div className={classReader('col-12 col-sm-6 col-lg-2')}>
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
     
      {/* <div className={classReader('col-12 col-sm-6 col-lg-2')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>到期區間（起）</div>
          <DatePicker
            className={classReader('mb-4')}
            name="expiryDateStart"
            control={control}
            validate={FORM_VALIDATES.expiryDateStart}
          />
        </div>
      </div>

      <div className={classReader('col-12 col-sm-6 col-lg-2')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>到期區間（訖）</div>
          <DatePicker
            className={classReader('mb-4')}
            name="expiryDateEnd"
            control={control}
            validate={FORM_VALIDATES.expiryDateEnd}
          />
        </div>
      </div> */}

    </>
  })

  const tableColumns = [
    {
      name: 'main',
      label: '短網址',
      options: {
        customBodyRender: (value) => <div className={classReader('d-flex column-basic-2')}>
          <div className={classReader('d-flex flex-center mr-2')}>
            <div className={classReader('list-bg-image')} style={{ backgroundImage: `url(${value.imageUrl || '/imageNotFound.svg'})` }}></div>
          </div>
          <div>
            <div className={classReader('bold mb-1')}>{value.title}</div>
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
          return <div className={classReader('column-target-url word-break')} title="123">
            {value}
          </div>
        },
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
      name: 'createKind',
      label: '短網址類別',
      options: {
        customHeadLabelRender: (columnMeta) => <div className={classReader('text-center')}>{columnMeta.label}</div>,
        customBodyRender: (value) => {
          return <div className={classReader('column-basic-3 text-center')}>{value}</div>
        },
      },
    },
    {
      name: 'realTimeClick',
      label: '近1小時點擊數',
      options: {
        customHeadLabelRender: (columnMeta) => <div className={classReader('text-right')}>{columnMeta.label}</div>,
        customBodyRender: (value) => {
          return <div className={classReader('column-basic-3 text-right')}>{value}</div>
        },
      },
    },
    {
      name: 'totalClick',
      label: '總點擊數',
      options: {
        customHeadLabelRender: (columnMeta) => <div className={classReader('text-center')}>
          <div>{columnMeta.label}</div>
          <div className={classReader('text-sm text-nowrap')}>（不包含近一小時）</div>
        </div>,
        customBodyRender: (value) => {
          return <Link href={`/analysis/effect/detail/${value.id}`}>
            <div className={classReader('column-basic-2 text-right primary')}><b><u>{value.count}</u></b></div>
          </Link>
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
      fetchAPI={analysisAPI.getEffect}
      APIResultFormatter={analysisEffectFormatter}
      tableColumns={tableColumns}
      tagsFromUserClick={tagsFromUserClick}
      customToolbar={() => <ExportButton />}
      searchBarChildren={() => <SearchBarChildren />}
      handleSubmit={handleSubmit}
      reset={handleReset}
      setValue={setValue}
      getValues={getValues}
      ref={tableRef}
    />
  </>
}

export default Effect
Effect.layout = (page) => <Layout>{page}</Layout>