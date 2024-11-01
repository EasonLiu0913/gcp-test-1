import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { TAB_TITLE_SUFFIX } from 'config/head'
import { handleHeadParams } from 'utils/util'
import classReader from 'utils/classReader'
import memberAPI from 'apis/member'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Button from 'common/Button'
import Input from 'common/form/Input'
import Modal from 'common/Modal'
import LoginLayoutPanel from 'page-components/login/LoginLayoutPanel'
import { USE_FORM_CONFIG } from 'config/config'
import { ERROR_CODE_LABEL } from 'config/error'
import { hookFormValidates } from 'utils/hookFormValidates'

export async function getServerSideProps(context) {
  const headParams = handleHeadParams(context)
  return { props: { ...headParams } }
}

const Index = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDlgOpen, setIsDlgOpen] = useState(false)
  const [dialogMsg, setDialogMsg] = useState(ERROR_CODE_LABEL[9999])
  const headTitle = `忘記密碼${TAB_TITLE_SUFFIX}`

  const {
    register, handleSubmit, formState: { errors },
  } = useForm(USE_FORM_CONFIG)

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const { message, success } = await memberAPI.forgetPassword(data)
      if (success) {
        switch (message) {
        // 成功的話，後端會傳兩種 message：'invite', 'forget'
        // invite: 曾邀請過但帳號尚未啟用
        // forget: 曾邀請過且帳號已啟用
        case 'invite':
          setDialogMsg('已寄送邀請連結至您的信箱內，請確認信箱內信件並跟隨指示完成帳號啟用')
          break
        default:
          setDialogMsg('已寄送重設密碼連結至您的信箱內，請確認信箱內信件並跟隨指示重置密碼')
          break
        }
      }
    }
    catch (e) {
      // 如果查詢不到該使用者，API 返回 status:400，message:'查無會員資料'
      setDialogMsg(e?.message || ERROR_CODE_LABEL[9999])
    }
    finally {
      setIsDlgOpen(true)
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>{headTitle}</title>
      </Head>
      <LoginLayoutPanel
        id="forgetPassword"
        title="忘記密碼"
        subTitle="請輸入你註冊的Email，我們將寄送更改密碼通知"
      >
        <div className={classReader('mb-2 mt-1')}>
          <label className={classReader('text-title d-block m-0 pb-2')}>Email</label>
          <Input
            size="lg"
            name="email"
            register={register}
            validate={hookFormValidates().email}
            controllerError={errors?.email?.message}
          />
        </div>

        <Button
          className={classReader('m-0 w-100 mt-4 btn-lg h6')}
          type="button"
          label="忘記密碼"
          color="primary"
          textColor="white"
          onClick={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
        />
        <Button
          className={classReader('m-0 w-100 mt-3 btn-lg h6')}
          type="button"
          label="返回登入"
          color="primary-light"
          textColor="primary"
          onClick={() => router.push('/login')}
        />
      </LoginLayoutPanel>

      <Modal
        prompt={isDlgOpen}
        title="寄送成功"
        okBtn="確定"
        onOk={() => setIsDlgOpen(false)}
        onClose={() => setIsDlgOpen(false)}
        close
      >
        <p className={classReader('text-center')}>
          {dialogMsg}
        </p>
      </Modal>
    </>
  )
}
export default Index