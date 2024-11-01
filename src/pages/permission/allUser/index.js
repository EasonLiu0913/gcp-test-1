import React, {
  useState, useEffect, memo, useRef,
} from 'react'
import Head from 'next/head'
import classReader from 'utils/classReader'
import { handleHeadParams, useCheckPermission } from 'utils/util'
import { TAB_TITLE_SUFFIX } from 'config/head'
import { BREADCRUMBS_OPTION } from 'config/breadcrumbs'
import Breadcrumbs from 'common/Breadcrumbs'
import Layout from 'common/layout/Layout'
import { USE_FORM_CONFIG } from 'config/config'
import { useForm } from 'react-hook-form'
import TableWithSearch from 'common/TableWithSearch'
import projectAPI from 'apis/project'
import roleAPI from 'apis/role'
import { allMemberFormatter } from 'utils/dataFormatter'
import Badge from 'common/Badge'
import { useSnackbar } from 'notistack'
import { useRouter } from 'next/router'
import Button from 'common/Button'
import Modal from 'common/Modal'
import Input from 'common/form/Input'
import Select from 'common/form/Select'
import ReactLoading from 'react-loading'
import { DEFAULT_SIZES } from 'config/style'
import { ERROR_CODE_LABEL } from 'config/error'
import { selectUser, setUser } from 'slices/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import memberAPI from 'apis/member'
import { useError } from 'context/ErrorContext'
import { hookFormValidates } from 'utils/hookFormValidates'
import { getCurrentTimestamp } from 'utils/date'

// 預留 SSR 區塊
export async function getServerSideProps(context) {
  const headParams = handleHeadParams(context)
  return { props: { ...headParams } }
}

const pageCode = '205'
const pageName = '所有使用者管理'
const headTitle = `${pageName}${TAB_TITLE_SUFFIX}`

const AllUser = () => {
  const [tagsFromUserClick] = useState([]) 
  const [brandList, setBrandList] = useState([])
  const [roleList, setRoleList] = useState([])
  const [isOpenUserDlg, setIsOpenUserDlg] = useState(false)
  const [isOpenDeleteDlg, setIsOpenDeleteDlg] = useState(false)
  const [isOpenResendDlg, setIsOpenResendDlg] = useState(false)
  const [targetUser, setTargetUser] = useState(null)
  const tableRef = useRef(null)
  const [
    R,
    W,
    D,
  ] = useCheckPermission(pageCode)
  
  const { reportError } = useError()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
  } = useForm({
    ...USE_FORM_CONFIG,
    defaultValues: {
      email: '',
      enableStatus: 0,
      name: '',
      projectId: 0,
      pageSize: 10,
    },
  })

  const SearchBarChildren = memo( function SearchBarChildren() {
    return <>
      <div className={classReader('col-12 col-sm-6 col-md-3')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>姓名</div>
          <Input
            className={classReader('w-100')}
            name="memberName"
            register={register}
          />
        </div>
      </div>

      <div className={classReader('col-12 col-sm-6 col-md-3')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>Email</div>
          <Input
            name="email"
            register={register}
          />
        </div>
      </div>

      <div className={classReader('col-12 col-sm-6 col-md-3')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>啟用狀態</div>
          <Select
            name="enableStatus"
            options={[
              {
                label: '全部',
                value: 0,
              },
              {
                label: '啟用',
                value: 1,
              },
              {
                label: '停用',
                value: 2,
              },
            ]}
            register={register}
            onChange={(name, val) => setValue(name, val)}
          />
        </div>
      </div>

      <div className={classReader('col-12 col-sm-6 col-md-3')}>
        <div className={classReader('px-2')}>
          <div className={classReader('text-title')}>品牌</div>
          <Select
            name="projectId"
            options={brandList}
            register={register}
            onChange={(name, val) => setValue(name, val)}
          />
        </div>
      </div>
    </>
  })

  const tableColumns = [
    {
      name: 'index',
      label: '編號',
      options: {
        customHeadLabelRender: (columnMeta) => <div className={classReader('text-center')}>{columnMeta.label}</div>,
        customBodyRender: (value) => {
          return <div className={classReader('column-index text-center')}>
            {value}
          </div>
        },
      },
    },
    {
      name: 'memberName',
      label: '姓名',
      options: {
        customBodyRender: (value) => <div
          className={classReader('column-basic-2')}>
          {value}
        </div>,
      },
    },
    {
      name: 'company',
      label: '公司',
      options: {
        customBodyRender: (value) => <div
          className={classReader('column-basic-4')}>
          {value}
        </div>,
      },
    },
    {
      name: 'email',
      label: '電子信箱',
      options: {
        customBodyRender: (value) => <div
          className={classReader('column-basic-5 word-break')}>
          {value}
        </div>,
      },
    },
    {
      name: 'roleName',
      label: '權限角色',
      options: {
        customBodyRender: (value) => <div
          className={classReader('column-basic-3')}>
          {value}
        </div>,
      },
    },
    {
      name: 'projectName',
      label: '品牌名稱',
      options: {
        customBodyRender: (value) => <div
          className={classReader('column-basic-3')}>
          {value}
        </div>,
      },
    },
    {
      name: 'isEnabled',
      label: '狀態',
      options: {
        customHeadLabelRender: (columnMeta) => <div className={classReader('text-center')}>{columnMeta.label}</div>,
        customBodyRender: value => {
          if (value) {
            return <div className={classReader('column-basic-2 text-center')}>
              <Badge className={classReader('px-3')} color="green" rounded>啟用</Badge>
            </div>
          } else {
            return <div className={classReader('column-basic-2 text-center')}>
              <Badge className={classReader('px-3')} color="green" outline rounded>確認中</Badge>
            </div>
          }
        },
      },
    },
    {
      name: 'action',
      label: '操作',
      options: {
        customHeadLabelRender: (columnMeta) => W && <div className={classReader('text-center')}>{columnMeta.label}</div>,
        customBodyRender: (value) => {
          return W && (
            <div className={classReader('action-column')}>
              <div
                className={classReader('bg-green action-btn')}
                onClick={() => {
                  setTargetUser(value)
                  setIsOpenUserDlg(true)
                }}
              >
                <i className={classReader('icon icon-edit icon-white')}/>
              </div>

              {D &&
              <div
                className={classReader('bg-red action-btn')}
                onClick={() => {
                  setTargetUser(value)
                  setIsOpenDeleteDlg(true)
                }}
              >
                <i className={classReader('icon icon-delete icon-white')}/>
              </div>
              }
              {
                !value.isEnabled && <div
                  className={classReader('bg-blue action-btn')}
                  onClick={() => {
                    setTargetUser(value)
                    setIsOpenResendDlg(true)
                  }}
                >
                  <i className={classReader('icon icon-outgoing-mail icon-white')} />
                </div>
              }
            </div>
          )
        },
      },
    },
  ]

  const CreateButton = memo( function CreateButton() {
    return W && <Button
      className={classReader('table-header-btn m-0')}
      color="green"
      label="邀請使用者"
      onClick={() => {setIsOpenUserDlg(true)}}
    />
  })
  

  const handleGetBrandSelectList = async () => {
    try {
      const result = await projectAPI.getBrandSelectList()
      const { data, success } = result
      if (!success) return reportError({ errorNo: result.errorNo || 9999 })
      setBrandList(data.map(item => {
        return {
          label: item.value,
          value: item.key,
        }
      }))
    } catch (err) {
      err.message = '取得品牌列表失敗'
      reportError(err)
    }
  }

  const handleGetRoleSelectList = async () => {
    try {
      const result = await roleAPI.getRoleSelectList()
      const { data, success } = result
      if (!success) return reportError({ errorNo: result.errorNo || 9999 })
      setRoleList(data.map( item => {
        return {
          value: item.key,
          label: item.value,
        }
      }))
    } catch (err) {
      err.message = '取得品牌列表失敗'
      reportError(err)
    }
  }

  useEffect(() => {
    handleGetBrandSelectList()
    handleGetRoleSelectList()
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

      <TableWithSearch
        ref={tableRef}
        fetchAPI={projectAPI.getMemberAll}
        APIResultFormatter={allMemberFormatter}
        tableColumns={tableColumns}
        tagsFromUserClick={tagsFromUserClick}
        customToolbar={() => <CreateButton />}
        searchBarChildren={() => <SearchBarChildren />}
        handleSubmit={handleSubmit}
        reset={reset}
        setValue={setValue}
        getValues={getValues}
      />

      <UserDlg
        isOpen={isOpenUserDlg}
        brandList={brandList}
        closeDlg={() => {setIsOpenUserDlg(false); setTargetUser(null)}}
        editUser={targetUser}
        roleList={roleList}
        fetchData={tableRef.current?.fetchData}
      />

      <DeleteDlg
        isOpen={isOpenDeleteDlg}
        deleteUser={targetUser}
        closeDlg={() => {setIsOpenDeleteDlg(false); setTargetUser(null)}}
        fetchData={tableRef.current?.fetchData}
      />

      <ResendDlg
        isOpen={isOpenResendDlg}
        resendUser={targetUser}
        closeDlg={() => {setIsOpenResendDlg(false); setTargetUser(null)}}
      />
    </>
  )
}

const UserDlg = ({
  brandList,
  closeDlg,
  editUser,
  fetchData,
  isOpen,
  roleList,  
}) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [isOpenSuccessDlg, setIsOpenSuccessDlg] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const { reportError } = useError()
  const {
    register, handleSubmit, formState: { errors }, reset, setValue,
  } = useForm({
    ...USE_FORM_CONFIG,
    defaultValues: {
      email: '',
      projectId: null,
      roleId: null,
    },
  })

  const handleCloseDlg = () => {
    closeDlg()
    reset()
    setIsOpenSuccessDlg(false)
  }

  const onSubmit = async (data) => {
    try {
      if (editUser) {
        const params = {
          memberId: editUser.memberId,
          projectId: data.projectId,
          roleId: data.roleId,
        }
        const result = await projectAPI.editMember(params)
        if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })
        enqueueSnackbar('更新成功', { className: classReader('success bg-success-light') })
      } else {
        const params = {
          invitedEmail: data.email,
          projectId: data.projectId,
          returnUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/login/activate`,
          roleId: data.roleId,     
        }
        const result = await projectAPI.inviteMember(params)
        if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })
        enqueueSnackbar('邀請成功', { className: classReader('success bg-success-light') })

        // 新增成功，進行比對
        if (data.email === user.email) {
        // 重新整理以更新所有資訊
          router.push(router.asPath, { query: { t: getCurrentTimestamp() } })
        }
      }
    } catch (err) {
      reportError(err)
    } finally {
      handleCloseDlg()
      fetchData()
    }
  }

  useEffect(() => {
    setValue('email', editUser?.email)
    setValue('projectId', editUser?.projectId)
    setValue('roleId', editUser?.roleId)
  }, [editUser])

  return <>
    <Modal
      prompt={isOpen}
      title={editUser ? '編輯使用者' : '新增使用者'}
      okBtn="確定"
      onOk={handleSubmit(onSubmit)}
      cancelBtn="取消"
      onCancel={handleCloseDlg}
      persistent
    >
      <div className={classReader('w-100')}>
        <div className={classReader('text-title', { 'text-required': !editUser })}>Email</div>
        {
          editUser ? <div className={classReader('mb-4')}>{editUser.email}</div> : <Input
            name="email"
            register={register}
            validate={hookFormValidates().email}
            controllerError={errors?.email?.message}
          />
        }

      </div>
      <div className={classReader('w-100')}>
        <div className={classReader('text-title', { 'text-required': !editUser })}>品牌名稱</div>
        {
          editUser ? <div className={classReader('mb-4')}>{editUser.brandName}</div> : <Select
            name="projectId"
            placeholder="請選擇品牌"
            options={brandList.filter( e => e.label !== '全部' || e.value !== 0)}
            register={register}
            validate={hookFormValidates().brandNameSelect}
            onChange={(name, val) => setValue(name, val)}
            controllerError={errors?.projectId?.message}
          />
        }

      </div>
      <div className={classReader('w-100')}>
        <div className={classReader('text-title text-required')}>權限</div>
        <Select
          name="roleId"
          placeholder="請選擇權限角色"
          options={roleList}
          register={register}
          validate={hookFormValidates().role}
          onChange={(name, val) => setValue(name, val)}
          controllerError={errors?.roleId?.message}
        />
      </div>
    </Modal>

    <Modal
      prompt={isOpenSuccessDlg}
      title="系統通知"
      okBtn="確認"
      onOk={handleCloseDlg}
    >
      <p>已寄送開通Email 給使用者，請通知使用者確認Email 信箱</p>
    </Modal>
  </>
}

const DeleteDlg = ({
  closeDlg,
  deleteUser,
  fetchData,
  isOpen,  
}) => {
  const router = useRouter()
  const user = useSelector(selectUser)
  const { reportError } = useError()
  const handleDelete = async () => {
    try {
      const result = await projectAPI.deleteMember({
        memberId: deleteUser.memberId,
        projectId: deleteUser.projectId, 
      })
      if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })

      // 新增成功，進行比對
      if (deleteUser.email === user.email) {
        // 重新整理以更新所有資訊
        router.push(router.asPath, { query: { t: getCurrentTimestamp() } })
      }
      fetchData()
      closeDlg()
    } catch (err) {
      reportError(err)
    }
  }

  return <Modal
    prompt={isOpen}
    title="刪除確認"
    okBtn="確認"
    onOk={handleDelete}
    cancelBtn="取消"
    onCancel={closeDlg}
    reverseBtn={true}
  >
    <p>是否確認刪除？</p>
    <div className={classReader('text-left')}>
      <div className={classReader('mb-1 text-secondary')}>姓名：{deleteUser?.memberName}</div>
      <div className={classReader('mb-1 text-secondary')}>Email：{deleteUser?.email}</div>
      <div className={classReader('mb-1 text-secondary')}>品牌名稱：{deleteUser?.brandName}</div>
      <div className={classReader('mb-1 text-secondary')}>權限角色：{deleteUser?.roleName}</div>
    </div>
  </Modal>
}

const ResendDlg = ({
  closeDlg,
  isOpen,
  resendUser,
}) => {
  const [isSending, setIsSending] = useState(true)
  const [msg, setMsg] = useState('')
  
  const handleResendInviteMail = async () => {
    setIsSending(true)
    try {
      const params = {
        id: resendUser.id,
        projectId: resendUser.projectId,
        returnUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/login/activate`,
      }
      const result = await projectAPI.resendInviteMail(params)
      if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })
      setMsg(`已重新寄送Email 通知給 ${resendUser.email}`)
    } catch (err) {
      setMsg(err.message || ERROR_CODE_LABEL[9999])
    } finally {
      setIsSending(false)
    }
  }

  useEffect(() => {
    if (isOpen) handleResendInviteMail()
  }, [isOpen])

  return <Modal
    prompt={isOpen}
    title="系統通知"
    okBtn={isSending ? '' : '確認'}
    onOk={closeDlg}
  >
    {
      isSending ?
        <div>
          <p>寄送中...</p>
          <ReactLoading
            className={classReader('m-auto loading-color')}
            type="spin"
            height={DEFAULT_SIZES.md * 2.5}
            width={DEFAULT_SIZES.md * 2.5}
          />
        </div> :
        <p>{msg}</p>
    }
  </Modal>
}

export default AllUser
AllUser.layout = (page) => <Layout>{page}</Layout>

