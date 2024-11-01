import React, { useState, useEffect } from 'react'
import classReader from 'utils/classReader'
import Input from 'common/form/Input'
import MultiSelectInput from 'common/form/MultiSelectInput'
import DatePicker from 'common/form/DatePicker'
import Select from 'common/form/Select'
import Button from 'common/Button'
import Modal from 'common/Modal'
import { useRouter } from 'next/router'
import { nextStep } from 'slices/stepperSlice'
import { useDispatch } from 'react-redux'
import UploadButton from 'common/UploadButton'
import shortenerIndividualAPI from 'apis/shortenerIndividual'
import { hookFormValidates } from 'utils/hookFormValidates'
import { rules } from 'utils/validation'
import { URCHIN_UTM } from 'config/getParameters'

const FormOne = ({
  control,
  formState: { errors },
  getValues,
  register,
  setValue,
  trigger,  
}) => {

  const [isOpenExitDlg, setIsOpenExitDlg] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()
  const [filePath, setFilePath] = useState('')
  const [filePathRequired, setFilePathRequired] = useState(false)

  const handleNext = async () => {
    const validationResult = await trigger([
      'campaignName',
      'destUrl',
      'title',
      'filePath',
      'campaignStartDate',
      'tags',
      'code',
    ])

    if (!validationResult) return
    
    const destUrl = new URL(getValues('destUrl'))
    const getData = destUrl.searchParams

    URCHIN_UTM.map(item => {
      let value = getData.get(item)
      value = rules.required(value) ? value : ''

      switch (item) {
      case 'utm_source':
        setValue('utmSource', value)  
        break
      case 'utm_medium':
        setValue('utmMedium', value)  
        break
      case 'utm_campaign':
        setValue('utmCampaign', value)  
        break
      case 'utm_term':
        setValue('utmTerm', value)  
        break
      case 'utm_content':
        setValue('utmContent', value)  
        break
      }
    })

    dispatch(nextStep())
  }

  const downloadTemplate = async () => {
    try {
      let result = await shortenerIndividualAPI.downloadSampleFile()
      const href = URL.createObjectURL(result)
      const link = document.createElement('a')
      link.href = href
      link.setAttribute('download', '1on1Template.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(href)
    } catch (err) {
      console.error('downloadTemplate ~ error:', err)
    }
  }

  useEffect(() => {
    if (getValues().oneOnOneFile && getValues().oneOnOneFile.length > 0) {
      setFilePath(getValues().oneOnOneFile[0].name)
      setFilePathRequired(true)
    }
    
    if (router.isReady && !rules.required(router?.query?.id) ) {
      setFilePathRequired(true)
    }
  }, [router.isReady])
  
  useEffect(() => {
  }, [filePathRequired, filePath])

  return (
    <div className={classReader({ ShortenerStyle: 'create-form' })}>

      <div className={classReader('px-2', !filePathRequired && filePath === '' && 'd-none' )}>
        <div className={classReader('text-title text-required')}>行銷活動名稱</div>
        <Input
          name="campaignName"
          register={register}
          validate={!filePathRequired && filePath === '' ? {} : hookFormValidates().campaignName }
          controllerError={errors?.campaignName?.message}
        />
      </div>
        
      <div className={classReader('px-2 pb-3')}>
        <div className={classReader('text-title text-required')}>匯入的CSV檔案</div>
        <div className={classReader('mb-2')}>{filePath}</div>
        <UploadButton
          className={classReader('ml-0')}
          label="匯入檔案"
          register={register}
          name="oneOnOneFile"
          onChange={() => setFilePath(getValues().oneOnOneFile[0].name)}
          validate={ hookFormValidates().filePath }
          controllerError={errors?.filePath?.message}
          acceptType=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />
        <Button color="secondary" icon="download" label="下載範本" onClick={downloadTemplate} />
      </div>

      <div className={classReader('px-2')}>
        <div className={classReader('text-title text-required')}>資料記錄起日（建議填寫發送日期，連續紀錄15天的成效數據）</div>
        <DatePicker
          className={classReader('mb-4')}
          name="campaignStartDate"
          control={control}
          validate={hookFormValidates().campaignStartDate}
          // disabled={!Boolean(filePath)}
        />
      </div>

      <div className={classReader('px-2 mb-4')}>
        <hr className={classReader('border-top')} />
      </div>

      <div className={classReader('px-2')}>
        <div className={classReader('text-title text-required')}>目標網址</div>
        <Input
          name="destUrl"
          register={register}
          validate={hookFormValidates().destUrl}
          controllerError={errors?.destUrl?.message}
        />
      </div>

      <div className={classReader('px-2')}>
        <div className={classReader('text-title text-required')}>標題</div>
        <Input
          name="title"
          register={register}
          validate={hookFormValidates().title}
          controllerError={errors?.title?.message}

        />
      </div>

      <div className={classReader('px-2')}>
        <div className={classReader('text-title text-required')}>標籤</div>
        <MultiSelectInput
          name="tags"
          placeholder={'輸入完畢後，按Enter 可新增標籤'}
          control={control}
          validate={hookFormValidates().tags}
          getValues={getValues}
        />
      </div>
      { !filePathRequired ? <>

        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>短網址代碼</div>
          <Input
            name="code"
            register={register}
            disabled={true}
          />
        </div>
      </> : <>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>客製化文字</div>
          <Input
            name="code"
            placeholder="https://ourl.tw/客製化文字"
            register={register}
            validate={hookFormValidates().urlPath}
            controllerError={errors?.code?.message}
          />
        </div>
      </>}


      <div className={classReader('row')}>
        <div className={classReader('col-12 col-md-4')}>
          <div className={classReader('px-2')}>
            <div className={classReader('text-title')}>到期日（下架日期）</div>
            <DatePicker
              className={classReader('mb-4')}
              name="expiryDate"
              control={control}
              // value={null}
              // validate={hookFormValidates().expiryDate}
            />
          </div>
        </div>

        <div className={classReader('col-12 col-md-4')}>
          <div className={classReader('px-2')}>
            <div className={classReader('text-title')}>啟用/關閉</div>
            <Select
              name="isEnabled"
              options={[
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

        <div className={classReader('col-12 col-md-4')}>
          <div className={classReader('px-2')}>
            <div className={classReader('text-title')}>是否夾帶網址參數</div>
            <Select
              name="isGetParams"
              options={[
                {
                  label: '是',
                  value: true,
                },
                {
                  label: '否',
                  value: false,
                },
              ]}
              register={register}
              onChange={(name, val) => setValue(name, val)}
            />
          </div>
        </div>
      </div>

      <div className={classReader('py-3', { ShortenerStyle: 'btn-row' })}>
        <Button color="red" onClick={() => setIsOpenExitDlg(true)} label="取消" />
        <Button onClick={handleNext} label="下一步" />
      </div>

      <Modal
        prompt={isOpenExitDlg}
        okBtn="繼續新增"
        onOk={() => setIsOpenExitDlg(false)}
        cancelBtn="離開"
        onCancel={() => router.push('/shortener/one-on-one')}
      >
        <p className={classReader('text-center')}>您確定要停止新增1:1個人化短網址嗎？</p>
      </Modal>
    </div>
  )
}

export default FormOne