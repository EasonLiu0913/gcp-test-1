import React, { useState, useEffect } from 'react'
import classReader from 'utils/classReader'
import Input from 'common/form/Input'
import Button from 'common/Button'
import { prevStep } from 'slices/stepperSlice'
import { useDispatch } from 'react-redux'
import shortenerAPI from 'apis/shortener'
import { useError } from 'context/ErrorContext'
import { useRouter } from 'next/router'
import ReactLoading from 'react-loading'
import { rules } from 'utils/validation'
import { removeTabsAndNewlines } from 'utils/valueFormat'
import { UNABLE_TO_CRAWL_DATAT } from 'config/shortener'

const FormThree = ({
  getValues,
  handleSubmit,
  isEditMode,
  register,
  setValue,  
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { reportError } = useError()
  const router = useRouter()
  const [hostname, setHostname] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [shareImage, setShareImage] = useState('-')
  const dispatch = useDispatch()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    dispatch({ type: 'loading/openLoading' })
    try {
      if (isEditMode) {
        const batchId = router?.query?.batchId
        const routerId = rules.required(batchId) ? `&batchId=${batchId}` : ''
        const result = await shortenerAPI.edit(data)
        if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })

        router.push(`/shortener/batch/list/edit/finish?url=${result.data}${routerId}`)
      } else {
        router.push(`/shortener/batch/list/finish?url=${result.data}`)
      }
    } catch (err) {
      reportError(err)
    } finally {
      setIsSubmitting(false)
      dispatch({ type: 'loading/closeLoading' })
    }
  }

  const changeValue = () => {
    setTitle(getValues('metaTitle'))
    setDescription(getValues('metaDesc'))
    setShareImage(getValues('metaImage'))
    setHostname(getValues('metaSiteName'))
  }

  const getShareData = async () => {
    try {
      const url = getValues('destUrl')
      const result = await shortenerAPI.getOgMeta({ url: url })
      const { data, success } = result
      
      if (!success) {
        getOgError()
        reportError(result)
        return
      }
      let ogSiteName = getValues('metaSiteName')
      let ogTitle = getValues('metaTitle')
      let ogDesc = getValues('metaDesc')
      let ogImage = getValues('metaImage')

      const name = removeTabsAndNewlines(data.name)
      const title = removeTabsAndNewlines(data.title)
      const desc = removeTabsAndNewlines(data.desc)
   
      setTitle(title)
      setDescription(desc)
    
      if (!rules.required(ogSiteName)) ogSiteName = name
      setValue('metaSiteName', ogSiteName)
      setHostname(ogSiteName)
    
      if (!rules.required(ogTitle)) ogTitle = title
      setValue('metaTitle', ogTitle)
    
      if (!rules.required(ogDesc)) ogDesc = desc
      setValue('metaDesc', ogDesc)
    
      if (!rules.required(ogImage)) ogImage = data?.image
      setValue('metaImage', ogImage)
      setShareImage(ogImage)
     
    } catch (err) {
      reportError({
        errorNo: err.errorNo,
        message: UNABLE_TO_CRAWL_DATAT, 
      })
      getOgError()
    }
  }
  
  const getOgError = () => {
    setShareImage('')
    setDescription(UNABLE_TO_CRAWL_DATAT)
  }

  const getMetaDataAgain = () => {
    setTitle('')
    setDescription('')
    setHostname('')
    setShareImage('-')
    setValue('metaSiteName', '')
    setValue('metaTitle', '')
    setValue('metaDesc', '')
    setValue('metaImage', '')
    getShareData()
  }

  useEffect(() => {

    const ogSiteName = rules.required(getValues('metaSiteName'))
    const ogTitle = rules.required(getValues('metaTitle'))
    const ogDesc = rules.required(getValues('metaDesc'))
    const ogImage = rules.required(getValues('metaImage'))
    if (!ogSiteName && !ogTitle && !ogDesc && !ogImage) getShareData()
    else changeValue()

  }, [])


  return <>
    <div className={classReader({ ShortenerStyle: 'create-form' })}>
      
      <div className={classReader('px-2')}>
        <div className={classReader({ ShortenerStyle: 'info' })}>您可以在以下欄位中定義分享時出現的資訊</div>
      </div>

      <div className={classReader('px-2')}>
        <div className={classReader({ ShortenerStyle: 'create-share-preview' }, 'row border rounded-8 overflow-hidden mb-3')}>
          <div className={classReader('col-12 col-sm-4')}>
            <div className={classReader({ ShortenerStyle: 'create-share-preview__img' }, 'bg-gray')}>
              <div 
                className={classReader('d-flex justify-content-center align-items-center img__aspect-ratio')} 
                style={{ backgroundImage: `url(${shareImage || '/imageNotFound.svg'})` }}
              >
                {shareImage === '-' && <ReactLoading
                  className={classReader('loading-color')}
                  type="spin"
                  height={32}
                  width={32}
                />}
              </div>
            </div>
          </div>
          <div className={classReader('col-12 col-sm-8')}>
            <div className={classReader({ ShortenerStyle: 'create-share-preview__info' }, 'p-2')}>
              <p className={classReader('text-md m-0 gray-6')}>{hostname}</p>
              <p className={classReader('text-xl my-1')}><b>{title}</b></p>
              <p className={classReader('text-md m-0 gray-6 ellipsis-2-lines')}>
                {description}
                {shareImage === '-' && '抓取資料中，請稍後...'}
              </p>
            </div>
          </div>
        </div>
        <div className={classReader('mb-3 pb-3 border-bottom')}>
          <Button
            className={classReader('m-0 text-sm', shareImage === '-' && 'gray-5')}
            color="text-secondary"
            outline
            onClick={shareImage === '-' ? () => {} : () => getMetaDataAgain()}
            disabled={isSubmitting}
            label={shareImage === '-' ? '抓取中，請稍後...' : '重新抓取'}
          />
        </div>
      </div>
      
      <div className={classReader('px-2')}>
        <div className={classReader('text-title')}>網站名稱</div>
        <Input
          name="metaSiteName"
          register={register}
          placeholder="og:site_name"
          onChange={changeValue}
          maxLength={200}
        />
      </div>

      <div className={classReader('px-2')}>
        <div className={classReader('text-title')}>頁面Title</div>
        <Input
          name="metaTitle"
          register={register}
          placeholder="og:title"
          onChange={changeValue}
          maxLength={200}
        />
      </div>

      <div className={classReader('px-2')}>
        <div className={classReader('text-title')}>頁面說明</div>
        <Input
          name="metaDesc"
          register={register}
          placeholder="og:description"
          onChange={changeValue}
          maxLength={200}
        />
      </div>

      <div className={classReader('px-2')}>
        <div className={classReader('text-title')}>分享圖片</div>
        <Input
          name="metaImage"
          register={register}
          placeholder="og:image"
          onChange={changeValue}
          maxLength={200}
        />
      </div>

      <div className={classReader('py-3', { ShortenerStyle: 'btn-row' })}>
        <Button color="text-secondary" onClick={() => dispatch(prevStep())} label="上一步" outline/>
        <Button
          color={shareImage === '-' ? 'gray-6' : 'green' }
          onClick={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
          label={shareImage === '-' ? 'OG 抓取中，請稍後...' : '儲存'}
          disabled={shareImage === '-' }
        />
      </div>

    </div>
  </>
  
}

export default FormThree