import React, {
  memo,
  useState,
  useEffect, 
} from 'react'
import Head from 'next/head'
import classReader from 'utils/classReader'
import Breadcrumbs from 'common/Breadcrumbs'
import { UI_VIEW, USE_FORM_CONFIG } from 'config/config'
import Input from 'common/form/Input'
import { hookFormValidates } from 'utils/hookFormValidates'
import { url_title } from 'utils/util'
import { rules } from 'utils/validation'
import { useForm } from 'react-hook-form'

const defaultValue = '<a> 3&&##&&&&%j&#)$%~(@)$ 我||_測 試 hk4g4weiAAAjj'

const URLTitle = () => {

  const [ dev, setDev ] = useState(false)
  const [ code1, setCode1 ] = useState(defaultValue)
  const [ code2, setCode2 ] = useState(defaultValue)
  const [ code3, setCode3 ] = useState(defaultValue)

  const {
    register, handleSubmit, setValue, control, reset, getValues, formState: { errors },
  } = useForm({
    ...USE_FORM_CONFIG,
    defaultValues: { 
      code: defaultValue,
      code1: defaultValue,
      code2: defaultValue,
      code3: defaultValue,
    },
  })

  useEffect(() => {
    if (UI_VIEW) setDev(true) 
    else window.location = '/404'
  }, [])

  return dev && (
    <>
      <Head>
        <title>URL TITLE</title>
        <meta name="description" content="URL TITLE" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex,nofollow" />
        <meta name="googlebot" content="noindex,nofollow" />
      </Head>

      <main className={classReader('mb-5')}>
        <div className={classReader('container')}>
          <h1>URL TITLE</h1>
          
          <div className={classReader('px-2')}>
            <div className={classReader('text-title')}>客製化文字 - 錯誤提示</div>
            <Input
              name="code"
              placeholder="https://ourl.tw/客製化文字"
              register={register}
              validate={hookFormValidates().urlPath}
              controllerError={errors?.code?.message}
            />
          </div>

          <div className={classReader('pt-3 pb-3')}>
            <hr />
          </div>

          <div className={classReader('px-2')}>
            <div className={classReader('text-title')}>客製化文字 - 自動過濾</div>
            <Input
              name="code1"
              placeholder="https://ourl.tw/客製化文字"
              register={register}
              validate={hookFormValidates().urlPath}
              onChange={(e) => {
                setCode1(e)
              }}
            />
            <div className={classReader('pt-3 pb-3')}>
              <div className={classReader('border p-2')}>
                <div className={classReader('text-title')}>自動過濾後</div>
                <p>{url_title(code1, '-')}</p>
              </div>
            </div>
          </div>

          <div className={classReader('pt-3 pb-3')}>
            <hr />
          </div>
          
          <div className={classReader('px-2')}>
            <div className={classReader('text-title')}>客製化文字 - 自動過濾 & 全轉小寫</div>
            <Input
              name="code2"
              placeholder="https://ourl.tw/客製化文字"
              register={register}
              validate={hookFormValidates().urlPath}
              onChange={(e) => {
                setCode2(e)
              }}
            />
            <div className={classReader('pt-3 pb-3')}>
              <div className={classReader('border p-2')}>
                <div className={classReader('text-title')}>自動過濾後</div>
                <p>{url_title(
                  code2, '-', true,
                )}</p>
              </div>
            </div>
          </div>
 
          <div className={classReader('pt-3 pb-3')}>
            <hr />
          </div>
          
          <div className={classReader('px-2')}>
            <div className={classReader('text-title')}>客製化文字 - 自動過濾 & 全轉小寫 & 不允許中文</div>
            <Input
              name="code3"
              placeholder="https://ourl.tw/客製化文字"
              register={register}
              validate={hookFormValidates().urlPath}
              onChange={(e) => {
                setCode3(e)
              }}
            />
            <div className={classReader('pt-3 pb-3')}>
              <div className={classReader('border p-2')}>
                <div className={classReader('text-title')}>自動過濾後</div>
                <p>{url_title(
                  code3, '-', true, true,
                )}</p>
              </div>
            </div>
          </div>
        </div>    
      </main>

    </>
  )
}

export default URLTitle