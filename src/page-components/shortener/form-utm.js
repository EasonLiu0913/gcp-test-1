import React, { useState, useEffect } from 'react'
import classReader from 'utils/classReader'
import Input from 'common/form/Input'
import Button from 'common/Button'
import { nextStep, prevStep } from 'slices/stepperSlice'
import { useDispatch } from 'react-redux'
import { urlUTMFilter } from 'utils/util'
import { FORM_VALUE_MAX_LENGTH } from 'config/formValidates'
import { SHORTENER_UTM_DATA } from 'config/shortener'

const FormUTM = ({
  formState: { errors },
  getValues,
  setValue,
  isEditMode,
  register,
  trigger,  
}) => {
  const dispatch = useDispatch()
  const [destUrl, setDestUrl] = useState('')

  const handleNext = async () => {
    const validationResult = await trigger([
      'utmSource',
      'utmMedium',
      'utmCampaign',
    ])
    if (!validationResult) return
    dispatch(nextStep())
  }

  const changeValue = () => {
    let utm = {
      'utm_source': getValues('utmSource'),
      'utm_medium': getValues('utmMedium'),
      'utm_campaign': getValues('utmCampaign'),
      'utm_term': getValues('utmTerm'),
      'utm_content': getValues('utmContent'),
    }
    const destUrl = urlUTMFilter(getValues('destUrl'), utm)
    setValue('destUrl', destUrl)
    setDestUrl(destUrl)
  }

  useEffect(() => {
    changeValue()
  }, [])

  return (
    <div className={classReader({ ShortenerStyle: 'create-form' })}>
      <div className={classReader('px-2')}>
        <div className={classReader({ ShortenerStyle: 'info' })}>
          <p className={classReader('m-0 pb-3')}>{SHORTENER_UTM_DATA.demo.title}</p>
          <label className={classReader('d-block m-0 pb-2 primary')}>{SHORTENER_UTM_DATA.demo.label}</label>
          <p className={classReader('m-0 text-break-all text-sm bg-warning-light gray-9 p-1')}>
            <b>{destUrl}</b>
          </p>
        </div>
      </div>

      {SHORTENER_UTM_DATA.utm.map((item, index) => 
        <div key={index} className={classReader('px-2')}>
          <div className={classReader('text-title')}>{item.title}</div>
          <Input
            name={item.name}
            register={register}
            placeholder={item.placeholder}
            onChange={changeValue}
            maxLength={FORM_VALUE_MAX_LENGTH[item.name]}
          />
        </div>)}

      <div className={classReader('py-3', { ShortenerStyle: 'btn-row' })}>
        <Button color="text-secondary" onClick={() => dispatch(prevStep())} label="上一步" outline/>
        <Button onClick={handleNext} label="下一步" />
      </div>

    </div>
  )
}

export default FormUTM