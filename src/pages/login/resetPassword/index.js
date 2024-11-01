import Head from 'next/head'
import { useRouter } from 'next/router'
import classReader from 'utils/classReader'
import { TAB_TITLE_SUFFIX } from 'config/head'
import { handleHeadParams } from 'utils/util'
import { useForm } from 'react-hook-form'
import Button from 'common/Button'
import Input from 'common/form/Input'
import { OAUTH, USE_FORM_CONFIG } from 'config/config'
import { useState } from 'react'
import memberAPI from 'apis/member'
import { ERROR_CODE_LABEL } from 'config/error'
import LoginLayoutPanel from 'page-components/login/LoginLayoutPanel'
import Modal from 'common/Modal'
import Cookies from 'js-cookie'
import { hookFormValidates } from 'utils/hookFormValidates'

export async function getServerSideProps(context) {
  const headParams = handleHeadParams(context)
  return { props: { ...headParams } }
}

const INVALID_TOKEN = '連結失效'

const Index = () => {
  const router = useRouter()
  const [errorDlgMsg, setErrorDlgMsg] = useState('')
  const [isSuccessDlgOpen, setIsSuccessDlgOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const headTitle = `設定密碼${TAB_TITLE_SUFFIX}`

  const {
    register, handleSubmit, formState: { errors }, 
  } = useForm(USE_FORM_CONFIG)

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      if (data.accountWord !== data.checkAccountWord) throw { message: ERROR_CODE_LABEL[1016] }

      let result = {}
      if (router.query?.token) {
        result = await memberAPI.resetPassword({
          ...data,
          returnUrl: `${process.env.NEXT_PUBLIC_DOMAIN}${router.asPath}`,
        })
      } else if (Cookies.get(OAUTH.TOKEN)) {
        result = await memberAPI.resetPasswordByLogin({ ...data })
      }
      if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })
     
      Cookies.remove(OAUTH.TOKEN)
      setIsSuccessDlgOpen(true)
     
    } catch (error) {
      setErrorDlgMsg(error.message ?? INVALID_TOKEN)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={classReader({ LoginStyle: 'reset-password' })}>
      <Head>
        <title>{headTitle}</title>
      </Head>

      <LoginLayoutPanel
        id="resetPassword"
        title="設定密碼"
        subTitle="請設定你的密碼"
      >
        <div className={classReader({ LoginStyle: 'content' })}>
          <>
            <label className={classReader('text-title d-block m-0 pb-2 text-required')}>密碼</label>
            <Input
              className={classReader('pb-2')}
              size="lg"
              type="password"
              name="accountWord"
              register={register}
              validate={hookFormValidates().pinWord}
              controllerError={errors?.accountWord?.message}
            />

            <label className={classReader('text-title d-block m-0 pb-2 text-required')}>再次輸入密碼</label>
            <Input
              className={classReader('pb-2')}
              size="lg"
              type="password"
              name="checkAccountWord"
              register={register}
              validate={hookFormValidates().pinCheckWord}
              controllerError={errors?.checkAccountWord?.message}
            />

            <Button
              className={classReader('m-0 w-100 mt-4 btn-lg mb-2')}
              type="button"
              label="重設密碼"
              color="primary"
              textColor="white"
              onClick={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
            />
            <Button
              className={classReader('m-0 w-100 mt-3 btn-lg')}
              type="button"
              label="返回登入"
              color="primary-light"
              textColor="primary"
              onClick={() => router.push('/login')}
            />
          </>
        </div>
      </LoginLayoutPanel>

      <Modal
        prompt={Boolean(errorDlgMsg)}
        okBtn="確認"
        onOk={async () => {
          if (errorDlgMsg === INVALID_TOKEN) {
            await router.replace('/login')
          } else {
            setErrorDlgMsg('')
          }
        }}
      >
        <p className={classReader('text-center')}>{errorDlgMsg}</p>
      </Modal>
      <Modal
        prompt={isSuccessDlgOpen}
        okBtn="確認"
        onOk={async () => await router.replace('/login')}
      >
        <p className={classReader('text-center')}>
          密碼設定成功，請按確定返回登入頁重新登入
        </p>
      </Modal>
    </div>
  )
}
export default Index