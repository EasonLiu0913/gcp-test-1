import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import classReader from 'utils/classReader'
import { handleHeadParams } from 'utils/util'
import { localStorage } from 'utils/storage'
import {
  OAUTH, 
  USE_FORM_CONFIG, 
  ENV_INFO, 
} from 'config/config'
import { TAB_TITLE_SUFFIX } from 'config/head'
import Button from 'common/Button'
import Input from 'common/form/Input'
import CheckBox from 'common/form/Checkbox'
import { useDispatch } from 'react-redux'
import { removeUser } from 'slices/userSlice'
import memberAPI from 'apis/member'
import Cookies from 'js-cookie'
import LoginLayoutPanel from 'page-components/login/LoginLayoutPanel'
import { useError } from 'context/ErrorContext'
import { hookFormValidates } from 'utils/hookFormValidates'


const REMEMBER_EMAIL = 'email'

export async function getServerSideProps(context) {
  const headParams = handleHeadParams(context)
  return { props: { ...headParams } }
}

const Login = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { reportError } = useError()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const headTitle = `登入${TAB_TITLE_SUFFIX}`

  const {
    register, handleSubmit, formState: { errors }, setValue, getValues, 
  } = useForm({
    ...USE_FORM_CONFIG,
    mode: 'onSubmit',
  })

  const handleRememberEmail = () => {
    let rememberEmail = getValues('rememberEmail')
    if (rememberEmail) {
      localStorage.set(REMEMBER_EMAIL, getValues('email'))
    } else {
      localStorage.remove(REMEMBER_EMAIL)
    }
  }

  const handleEmailChange = (value) => {
    if (getValues('rememberEmail')) {
      localStorage.set(REMEMBER_EMAIL, value)
    }
  }

  const onSubmit = async (params) => {
    setIsSubmitting(true)
    dispatch(removeUser())
    Cookies.remove(OAUTH.TOKEN)
    try {
      const result = await memberAPI.login(params)
      const { success, data } = result

      if (success) {
        Cookies.set(
          OAUTH.TOKEN, data, {
            expires: 1,
            secure: true, 
          },
        )

        // 登入成功
        if (router.query.redirectURL) {
          await router.push(router.query.redirectURL)
        } else {
          await router.push('/dashboard')
        }
      }
    } catch (err) {
      reportError(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAccountWordKeyDown = (key) => {
    if (key === 'Enter') {
      handleSubmit(onSubmit)

      document.querySelectorAll('input').forEach((e) => {
        e.blur()
      })
    }
  }

  useEffect(() => {
    const email = localStorage.get(REMEMBER_EMAIL)
    if (email) {
      setValue('rememberEmail', true)
      setValue('email', email)
    }
    dispatch(removeUser())
    Cookies.remove(OAUTH.TOKEN)
    // if (router.query.isTokenInvalid) {
    //   // setErrDlgMsg('登入資料已過期，請重新登入')
    // }

    localStorage.remove('remindNum')
    localStorage.remove('prevBrandDomain')
  }, [])

  return (
    <>
      <Head>
        <title>{headTitle}</title>
      </Head>

      <LoginLayoutPanel
        id="login"
        title="歡迎使用品牌短網址服務"
        linkLabel="申請品牌短網址服務"
        linkPath="/login/register"
      >
        <div className={classReader('mb-2 mt-1')}>
          <label className={classReader('text-title d-block m-0 pb-2')}>Email</label>
          <Input
            className={classReader('pb-2')}
            size="lg"
            name="email"
            register={register}
            validate={hookFormValidates().userName}
            controllerError={errors?.email?.message}
            onChange={handleEmailChange}
            autoFocus={localStorage.get(REMEMBER_EMAIL) ? false : true}
          />
        </div>

        <div className={classReader('mb-2 mt-1')}>
          <label className={classReader('text-title d-block m-0 pb-2')}>密碼</label>
          <Input
            className={classReader('mb-2')}
            type="password"
            name="accountWord"
            size="lg"
            register={register}
            validate={hookFormValidates().pinWord}
            controllerError={errors?.accountWord?.message}
            autoFocus={localStorage.get(REMEMBER_EMAIL) ? true : false}
            onKeyDown={handleAccountWordKeyDown}
          />
        </div>

        <div className={classReader('d-flex justify-content-between align-items-center pt-4')}>
          <CheckBox 
            size="sm" 
            label="記住Email"
            register={register}
            name="rememberEmail"
            onChange={handleRememberEmail}
          />
          <Link
            className={classReader('primary')}
            prefetch={false}
            href="/login/forgetPassword"
            aria-label="忘記密碼"
            passHref
          >
            忘記密碼?
          </Link>
        </div>

        <Button
          className={classReader('m-0 w-100 mt-3 btn-lg btn--unelevated h6')}
          type="button"
          label="登入"
          color="primary"
          textColor="white"
          onClick={() => handleSubmit(onSubmit)()}
          onBlue
          isLoading={isSubmitting}
        />

      </LoginLayoutPanel>
    </>
  )
}
export default Login