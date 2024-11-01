import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Head from 'next/head'
import { useRouter } from 'next/router'
import classReader from 'utils/classReader'
import { handleHeadParams } from 'utils/util'
import { TAB_TITLE_SUFFIX } from 'config/head'
import Button from 'common/Button'
import Input from 'common/form/Input'
import Modal from 'common/Modal'
import LoginLayoutPanel from 'page-components/login/LoginLayoutPanel'
import { USE_FORM_CONFIG } from 'config/config'
import Link from 'next/link'
import applicationAPI from 'apis/application'
import { useError } from 'context/ErrorContext'
import { hookFormValidates } from 'utils/hookFormValidates'

export async function getServerSideProps(context) {
  const headParams = handleHeadParams(context)
  return { props: { ...headParams } }
}

const Index = () => {
  const router = useRouter()
  const { reportError } = useError()
  const [openDialog, setOpenDialog] = useState(false)

  const headTitle = `申請服務${TAB_TITLE_SUFFIX}`
  
  const {
    register, handleSubmit, formState: { errors }, 
  } = useForm({
    ...USE_FORM_CONFIG,
    defaultValues: { status: 0 },
  })

  const onSubmit = async (data) => {
    try {
      const result = await applicationAPI.create(data)
      if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })
      setOpenDialog(true)
    } catch (err) {
      reportError(err)
    }
  }

  return (
    <>
      <Head>
        <title>{headTitle}</title>
      </Head>
      <LoginLayoutPanel
        id="register"
        title="申請品牌短網址服務"
        subTitle="請輸入您的申請資訊，待管理員審查後，會寄發信件給您。"
      >
        <div className={classReader('mb-4')}>
          <div className={classReader('text-title text-required')}>Email</div>
          <Input
            size="lg"
            name="email"
            register={register}
            validate={hookFormValidates().email}
            controllerError={errors?.email?.message}
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
          <div className={classReader('text-title text-required')}>品牌名稱</div>
          <Input
            size="lg"
            name="brandName"
            register={register}
            validate={hookFormValidates().brandName}
            controllerError={errors?.brandName?.message}
          />
        </div>

        <div className={classReader('mb-4')}>
          <div className={classReader('text-title text-required')}>網域名稱</div>
          <Input
            size="lg"
            name="brandDomain"
            register={register}
            validate={hookFormValidates().brandDomain}
            controllerError={errors?.brandDomain?.message}
          />
        </div>

        <div className={classReader('my-4')}>
          <Button
            className={classReader('m-0 w-100 mt-4 btn-lg h6')}
            type="button"
            label="送出"
            color="primary"
            textColor="white"
            onClick={handleSubmit(onSubmit)}
          />
        </div>
        <div>已經有帳戶？<Link className={classReader('primary')} href="/login">登入</Link></div>
      </LoginLayoutPanel>

      {/* <Modal
        prompt={Boolean(errorDlgMsg)}
        okBtn="確認"
        onOk={() => setErrorDlgMsg('')}
      >
        <p className={classReader('text-center')}>{errorDlgMsg}</p>
      </Modal>
       */}

      <Modal
        prompt={openDialog}
        title="註冊成功"
        okBtn="確定"
        onOk={async () => await router.push('/login')}
      >
        <div className={classReader('text-center')}>
          已申請成功，將由專人為您審核，再請前往Email 查看通知
        </div>
      </Modal>
    </>
  )
}
export default Index