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
import { hookFormValidates } from 'utils/hookFormValidates'
import { dateFormat } from 'utils/date'
import { MAX_DATE } from 'config/date'
import { FORM_VALUE_MAX_LENGTH } from 'config/formValidates'
import { rules } from 'utils/validation'
import { URCHIN_UTM } from 'config/getParameters'

const FormOne = ({
  control,
  formState: { errors },
  getValues,
  isEditMode,
  register,
  setValue,
  trigger,  
}) => {

  const [isOpenExitDlg, setIsOpenExitDlg] = useState(false)
  const [pathUrl, setPathUrl] = useState('batch')
  const router = useRouter()
  const dispatch = useDispatch()

  const handleNext = async () => {
    const validationResult = await trigger([
      'destUrl',
      'title',
      'tags',
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

  useEffect(() => {
    if (router.query.url) {
      setUrl(router.query.url)
    }
    setPathUrl(`batch/list/${router.query.batchId}`)
  }, [router.isReady])

  return (
    <div className={classReader({ ShortenerStyle: 'create-form' })}>
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
          maxLength={FORM_VALUE_MAX_LENGTH.title}
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

      {
        !isEditMode && <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>客製化文字</div>
          <Input
            name="code"
            placeholder="https://ourl.tw/客製化文字"
            register={register}
            validate={hookFormValidates().urlPath}
            controllerError={errors?.code?.message}
          />
        </div>
      }

      <div className={classReader('row')}>

        <div className={classReader('col-7 col-md-4')}>
          <div className={classReader('px-2')}>
            <div className={classReader('text-title')}>到期日（下架日期）</div>
            <div>
              <DatePicker
                className={classReader('mb-4')}
                name="expiryDate"
                control={control}
                validate={hookFormValidates().expiryDate}
              />
            </div>
          </div>
        </div>

        <div className={classReader('col-5 col-md-8')}>
          <div className={classReader('px-2')}>
            <div className={classReader('text-title')}>　</div>
            <Button 
              className={'gray-5 m-0'}
              color="text-secondary"
              onClick={() => setValue('expiryDate', dateFormat(MAX_DATE))}
              label="設定永久"
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
        okBtn={isEditMode ? '繼續編輯' : '繼續新增'}
        onOk={() => setIsOpenExitDlg(false)}
        cancelBtn="離開"
        onCancel={() => router.push(`/shortener/${pathUrl}`)}
      >
        <p className={classReader('text-center')}>您確定要停止{isEditMode ? '編輯' : '新增'}短網址嗎？</p>
      </Modal>
    </div>
  )
}

export default FormOne