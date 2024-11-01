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
import { selectUser } from 'slices/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { hookFormValidates } from 'utils/hookFormValidates'
import { rules } from 'utils/validation'
import { FORM_VALIDATES_MSG } from 'config/formValidates'
import { URCHIN_UTM } from 'config/getParameters'
import { v4 as uuidv4 } from 'uuid'

const FormOne = ({
  control,
  formState: { errors },
  getValues,
  register,
  setValue,
  trigger, 
  setError,
  clearErrors,
}) => {
  const user = useSelector(selectUser)
  const router = useRouter()
  const dispatch = useDispatch()
  const [isOpenExitDlg, setIsOpenExitDlg] = useState(false)
  const [filePathRequired, setFilePathRequired] = useState(false)
  const [dynamicInputs, setDynamicInputs] = useState([
    {
      uuid: uuidv4(),
      value: '',
    },
  ])
  const [urlPrefix, setUrlPrefix] = useState(`https://${user.defaultProjectBrandDomain}/${getValues('code') || '活動名稱'}/`)

  const checkParametersInputEmpty = () => {
    const parameters = getValues('parameters').filter(item => item !== '')
    if (parameters.length === 0){
      setError('parameters', { message: FORM_VALIDATES_MSG.parametersRequiredAtLeastOne })
      return true
    }
    else {
      clearErrors('parameters')
      return false
    }
  }

  const handleNext = async () => {
    const isParametersEmpty = checkParametersInputEmpty()
    const validationResult = await trigger([
      'destUrl',
      'title',
      'tags',
      'code',
      'parameters',
    ])
    
    if (!validationResult || isParametersEmpty) return
    
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
    if (router.isReady && !rules.required(router?.query?.id) ) setFilePathRequired(true)
  }, [router.isReady])

  useEffect(() => {
    if (getValues('parameters')) setDynamicInputs(prev => {
      if (dynamicInputs.length >= getValues('parameters').length){
        return prev.map((item, index) => ({
          ...item,
          value: getValues(`parameters[${index}]`),
        }))
      }
      else {
        return getValues('parameters')?.map(value => ({
          uuid: uuidv4(),
          value,
        }))
      }
    })
  }, [getValues('parameters')])

  useEffect(() => {
    if (getValues('code')) updateUrlPrefix()
  }, [getValues('code')])
  
  const addInput = () => {
    setDynamicInputs(prev => [
      ...prev,
      {
        uuid: uuidv4(),
        value: '',
      },
    ])
  }

  const removeInput = (index) => { 
    setDynamicInputs(prev => prev.filter((_, i) => i !== index))
    setValue('parameters', getValues('parameters').filter((_, i) => i !== index))
  }

  const handleInputChange = () => {
    checkParametersInputEmpty()
    setTimeout(() => {
      setDynamicInputs(prev => prev.map((item, index) => ({
        ...item,
        value: getValues(`parameters[${index}]`),
      })))
    }, 500)
  }

  const updateUrlPrefix = () => {
    setUrlPrefix(`https://${user.defaultProjectBrandDomain}/${getValues('code') || '活動名稱'}/`)
  }

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

      <div className={classReader('px-2')}>
        <div className={classReader('text-title text-required')}>活動名稱</div>
        <Input
          name="code"
          placeholder=""
          register={register}
          validate={hookFormValidates().parametersCode}
          controllerError={errors?.code?.message}
          onBlur={() => updateUrlPrefix()}
          disabled={!filePathRequired}
        />
      </div>

      <div className={classReader('px-2 field--with-bottom')}>
        <div className={classReader('text-title')}>您的短網址</div>
        {dynamicInputs.map((input, index) => (
          <div key={input.uuid} className={classReader('d-flex  align-items-center field--with-bottom')}>
            <div className={classReader({ ShortenerStyle: 'urlPrefix' })}>{urlPrefix}</div>
            <Input
              className={classReader('mb-0 grow-1', { ShortenerStyle: 'parameter-input' })}
              name={`parameters[${index}]`}
              register={register}
              onBlur={() => handleInputChange()}
              placeholder="您可以填入KOL,POI,業代,展間等資訊"
              controllerError={errors?.parameters?.message}
            />
            {dynamicInputs.length > 1 && (
              <Button
                color="secondary"
                icon="close"
                size="sm"
                rounded
                onMouseDown={() => removeInput(index)}
                className={classReader('ml-2 mr-0')}
              />
            )}
            {index === dynamicInputs.length - 1 && (
              <Button
                color="secondary"
                icon="add"
                size="sm"
                rounded
                onMouseDown={addInput}
                className={classReader('ml-2')}
              />
            )}
          </div>
        ))}
      </div>

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
        onCancel={() => router.push('/shortener/parameters')}
      >
        <p className={classReader('text-center')}>您確定要停止新增1:1個人化短網址嗎？</p>
      </Modal>
    </div>
  )
}

export default FormOne