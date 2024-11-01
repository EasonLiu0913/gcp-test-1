import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import classReader from 'utils/classReader'
import { handleHeadParams } from 'utils/util'
import { TAB_TITLE_SUFFIX } from 'config/head'
import { BREADCRUMBS_OPTION } from 'config/breadcrumbs'
import Breadcrumbs from 'common/Breadcrumbs'
import Layout from 'common/layout/Layout'
import CardSection from 'common/card/CardSection'
import Input from 'common/form/Input'
import { useForm } from 'react-hook-form'
import Button from 'common/Button'
import { USE_FORM_CONFIG } from 'config/config'
import { useSnackbar } from 'notistack'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from 'slices/userSlice'
import memberAPI from 'apis/member'
import { useError } from 'context/ErrorContext'
import { hookFormValidates } from 'utils/hookFormValidates'
import { getCurrentTimestamp } from 'utils/date'

// 預留 SSR 區塊
export async function getServerSideProps(context) {
  const headParams = handleHeadParams(context)
  return { props: { ...headParams } }
}

const Setting = () => {
  const pageName = '帳號設定'
  const headTitle = `${pageName}${TAB_TITLE_SUFFIX}`
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()
  const user = useSelector(selectUser)
  const { reportError } = useError()
  const dispatch = useDispatch()

  const {
    register, handleSubmit, setValue, control, formState: { errors },
  } = useForm(USE_FORM_CONFIG)

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const params = {
        id: user.id,
        name: data.name,
        company: data.company,
      }
      const result = await memberAPI.editUser(params)
      if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })
      enqueueSnackbar('更新成功', { className: classReader('success bg-success-light') })
      router.push(router.asPath, { query: { t: getCurrentTimestamp() } })
    } catch (err) {
      reportError(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    setValue('name', user.name)
    setValue('company', user.company)
    setValue('email', user.email)
  }, [])

  return (
    <>
      <Head>
        <title>{headTitle}</title>
      </Head>

      <div className={classReader('mb-4')}>
        <Breadcrumbs
          title={pageName}
          options={BREADCRUMBS_OPTION}
        />
      </div>

      <CardSection>
        <div className={classReader('card__section__title')}>帳號資訊</div>
        <hr className={classReader('mb-4 border')} />

        <div className={classReader('row')}>
          <div className={classReader('col-12 col-md-6')}>
            <div className={classReader('px-2')}>
              <div className={classReader('text-title')}>姓名</div>
              <Input
                name="name"
                register={register}
                validate={hookFormValidates().name}
                controllerError={errors?.name?.message}
              />
            </div>
          </div>

          <div className={classReader('col-12 col-md-6')}>
            <div className={classReader('px-2')}>
              <div className={classReader('text-title')}>公司</div>
              <Input
                name="company"
                register={register}
                validate={hookFormValidates().company}
                controllerError={errors?.company?.message}
              />
            </div>
          </div>

          <div className={classReader('col-12 col-md-6')}>
            <div className={classReader('px-2')}>
              <div className={classReader('text-title')}>Email</div>
              <Input
                name="email"
                register={register}
                disabled={true}
              />
            </div>
          </div>

          <div className={classReader('col-12 col-md-6')}>
            <div className={classReader('d-none d-md-block col-none text-title')}>　</div>
            <Button
              icon="outgoing-mail"
              outline={true}
              onClick={() => router.push('/login/resetPassword')}>
              修改密碼
            </Button>
          </div>
        </div>

        <div className={classReader('col-12 text-center mt-4')}>
          <Button
            color="green"
            onClick={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
          >儲存</Button>
        </div>

      </CardSection>
    </>
  )
}

export default Setting
Setting.layout = (page) => <Layout>{page}</Layout>