import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import classReader from 'utils/classReader'
import { TAB_TITLE_SUFFIX } from 'config/head'
import { handleHeadParams } from 'utils/util'
import { useForm } from 'react-hook-form'
import Button from 'common/Button'
import Input from 'common/form/Input'
import { OAUTH, USE_FORM_CONFIG } from 'config/config'
import memberApi from 'apis/member'
import LoginLayoutPanel from 'page-components/login/LoginLayoutPanel'
import Modal from 'common/Modal'
import { useError } from 'context/ErrorContext'
import Cookies from 'js-cookie'
import { ERROR_CODE_LABEL } from 'config/error'
import { hookFormValidates } from 'utils/hookFormValidates'

export async function getServerSideProps(context) {
  const headParams = handleHeadParams(context)
  return { props: { ...headParams } }
}

const Index = () => {
  const router = useRouter()
  const { reportError } = useError()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDlgOpen, setIsDlgOpen] = useState(false)

  const headTitle = `首次開通服務${TAB_TITLE_SUFFIX}`
  const {
    register, handleSubmit, formState: { errors }, 
  } = useForm(USE_FORM_CONFIG)

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      if (data.accountWord !== data.checkAccountWord) return reportError({
        errorNo: 1016,
        message: ERROR_CODE_LABEL[1016], 
      })

      const params = {
        ...data,
        returnUrl: `${process.env.NEXT_PUBLIC_DOMAIN}${router.asPath}`,
      }
      
      const result = await memberApi.enable(params)
      if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })
      
      Cookies.remove(OAUTH.TOKEN)
      setIsDlgOpen(true)
    } catch (err) {
      reportError(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>{headTitle}</title>
      </Head>
      <LoginLayoutPanel
        id="activate"
        title="首次開通服務"
        subTitle="請設定你的密碼及資訊"
      >
        <div>
          <div className={classReader('mb-4')}>
            <div className={classReader('text-title text-required')}>密碼</div>
            <Input
              size="lg"
              type="password"
              name="accountWord"
              register={register}
              validate={hookFormValidates().pinWord}
              controllerError={errors?.accountWord?.message}
            />
          </div>
          <div className={classReader('mb-4')}>
            <div className={classReader('text-title text-required')}>再次輸入密碼</div>
            <Input
              size="lg"
              type="password"
              name="checkAccountWord"
              register={register}
              validate={hookFormValidates().pinCheckWord}
              controllerError={errors?.checkAccountWord?.message}
            />
          </div>
          <div className={classReader('mb-4')}>
            <div className={classReader('text-title text-required')}>姓名</div>
            <Input
              size="lg"
              name="name"
              register={register}
              validate={hookFormValidates().name}
              controllerError={errors?.name?.message}
            />
          </div>
          <div className={classReader('mb-4')}>
            <div className={classReader('text-title text-required')}>公司</div>
            <Input
              size="lg"
              name="company"
              register={register}
              validate={hookFormValidates().company}
              controllerError={errors?.company?.message}
            />
          </div>
          <Button
            className={classReader('m-0 w-100 mt-4 btn-lg mb-2')}
            type="button"
            label="開通服務"
            color="primary"
            textColor="white"
            isLoading={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          />
          <Button
            className={classReader('m-0 w-100 mt-3 btn-lg')}
            type="button"
            label="返回登入"
            color="primary-light"
            textColor="primary"
            onClick={() => router.push('/login')}
          />
        </div>
      </LoginLayoutPanel>

      <Modal
        prompt={Boolean(isDlgOpen)}
        okBtn="確認"
        onOk={() => {router.replace('/login')}}
      >
        <p className={classReader('text-center')}>啟動成功，請重新登入</p>
      </Modal>
    </>
  )
}
export default Index