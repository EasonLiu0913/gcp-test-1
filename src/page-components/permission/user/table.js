import React, { useEffect, useState } from 'react'
import classReader from 'utils/classReader'
import Input from 'common/form/Input'
import MUIDataTable from 'common/MUIDataTable'
import Badge from 'common/Badge'
import Modal from 'common/Modal'
import Select from 'common/form/Select'
import { useForm } from 'react-hook-form'
import Button from 'common/Button'
import { USE_FORM_CONFIG } from 'config/config'
import { useError } from 'context/ErrorContext'
import { DEFAULT_SIZES } from 'config/style'
import ReactLoading from 'react-loading'
import { hookFormValidates } from 'utils/hookFormValidates'

const NAME_IN_COLUMN_INDEX = 1
const COMPANY_IN_COLUMN_INDEX = 2
const EMAIL_IN_COLUMN_INDEX = 3
const ROLE_IN_COLUMN_INDEX = 4

//暫時這樣處理，等有API 之後都是打API 拿DATA
let FAKE_DATA = []

const Table = ({
  data = [], //表格資料
  hasBrandName = false, //顯示「品牌名稱」欄位
}) => {
  const [targetUser, setTargetUser] = useState(null)
  const [column, setColumn] = useState([])
  const [isOpenUserDlg, setIsOpenUserDlg] = useState(false)
  const [isOpenDeleteDlg, setIsOpenDeleteDlg] = useState(false)
  const [isOpenResendDlg, setIsOpenResendDlg] = useState(false)
  //todo: temp
  const [tempData, setTempData] = useState([])

  useEffect(() => {
    let TABLE_COLUMN = [
      {
        name: 'id',
        label: '編號',
        options: {
          customBodyRender: (value, tableMeta) => {
            return <div className={classReader({ PermissionStyle: 'table__id' })}>
              {tableMeta.rowIndex + 1}
            </div>
          },
        },
      },
      {
        name: 'name',
        label: '姓名',
        options: {
          customBodyRender: (value) => <div
            className={classReader({ PermissionStyle: 'table__word-break' })}>
            {value}
          </div>,
        },
      },
      {
        name: 'company',
        label: '公司',
        options: {
          customBodyRender: (value) => <div
            className={classReader({ PermissionStyle: 'table__word-break' })}>
            {value}
          </div>,
        },
      },
      {
        name: 'email',
        label: '電子信箱',
        options: {
          customBodyRender: (value) => <div
            className={classReader({ PermissionStyle: 'table__word-break' })}>
            {value}
          </div>,
        },
      },
      {
        name: 'role',
        label: '權限角色',
        options: {
          customBodyRender: (value) => <div
            className={classReader({ PermissionStyle: 'table__role' })}>
            {value}
          </div>,
        },
      },
      {
        name: 'brandName',
        label: '品牌名稱',
        options: {
          customBodyRender: (value) => <div
            className={classReader({ PermissionStyle: 'table__word-break' })}>
            {value}
          </div>,
        },
      },
      {
        name: 'status',
        label: '狀態',
        options: {
          customHeadLabelRender: (columnMeta) => <div className={classReader('text-center')}>{columnMeta.label}</div>,
          customBodyRender: value => {
            if (value) {
              return <div className={classReader({ PermissionStyle: 'table__status' })}>
                <Badge className={classReader('px-3')} color="green" rounded>啟用</Badge>
              </div>

            } else {
              return <div className={classReader({ PermissionStyle: 'table__status' })}>
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
          customHeadLabelRender: (columnMeta) => <div className={classReader('text-center')}>{columnMeta.label}</div>,
          customBodyRender: (value, tableMeta) => {
            return <div className={classReader('action-column')}>
              <div
                className={classReader('bg-green action-btn')}
                onClick={() => {
                  setTargetUser({
                    id: tableMeta.rowIndex,
                    ...tableMeta.rowData,
                  })
                  setIsOpenUserDlg(true)
                }}
              >
                <i className={classReader('icon icon-edit icon-white')}/>
              </div>
              <div
                className={classReader('bg-red action-btn')}
                onClick={() => {
                  setTargetUser({
                    id: tableMeta.rowIndex,
                    ...tableMeta.rowData,
                  })
                  setIsOpenDeleteDlg(true)
                }}
              >
                <i className={classReader('icon icon-delete icon-white')} />
              </div>
              <div
                className={classReader('bg-blue action-btn')}
                onClick={() => {
                  setTargetUser({
                    id: tableMeta.rowIndex,
                    ...tableMeta.rowData,
                  })
                  setIsOpenResendDlg(true)
                }}
              >
                <i className={classReader('icon icon-outgoing-mail icon-white')} />
              </div>
            </div>
          },
        },
      },
    ]

    if (hasBrandName) setColumn(TABLE_COLUMN)
    else setColumn(TABLE_COLUMN.filter( item => item.name !== 'brandName'))
  }, [])

  //todo: temp
  useEffect(() => {
    setTempData(FAKE_DATA)
  }, [FAKE_DATA])

  //todo: temp
  useEffect(() => {
    setTempData(data)
    FAKE_DATA = data
  }, [data])

  return (
    <>
      <MUIDataTable
        data={tempData}
        columns={column}
        totalCount={79}
        options={{
          customToolbar: () => <Button
            className={classReader('table-header-btn m-0')}
            color="green"
            label="邀請使用者"
            onClick={() => {setIsOpenUserDlg(true)}}
          />,
        }}
      />

      <UserDlg
        isOpen={isOpenUserDlg}
        closeDlg={() => {setIsOpenUserDlg(false); setTargetUser(null)}}
        editUser={targetUser}
      />

      <DeleteDlg
        isOpen={isOpenDeleteDlg}
        deleteUser={targetUser}
        closeDlg={() => {setIsOpenDeleteDlg(false); setTargetUser(null)}}
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
  closeDlg,
  editUser,
  isOpen, 
}) => {
  const [isOpenSuccessDlg, setIsOpenSuccessDlg] = useState(false)
  const { reportError } = useError()
  const {
    register, handleSubmit, formState: { errors }, reset, setValue,
  } = useForm(USE_FORM_CONFIG)

  const resetAllDlg = () => {
    closeDlg()
    reset()
    setIsOpenSuccessDlg(false)
  }

  const onSubmit = (data) => {
    //todo: API here
    if (editUser) {
      reportError({ message: '更新成功' })
      //下面這行之後有API 要拿掉
      FAKE_DATA[editUser.id].role = data.role
      resetAllDlg()
    } else {
      FAKE_DATA.push({
        id: FAKE_DATA.length + 1,
        name: '(等待使用者填寫)',
        company: '(等待使用者填寫)',
        email: data.email,
        role: data.role,
        status: false,
      })

      setIsOpenSuccessDlg(true)
    }
  }

  useEffect(() => {
    if (editUser) {
      setValue('email', editUser[EMAIL_IN_COLUMN_INDEX])
      setValue('role', editUser[ROLE_IN_COLUMN_INDEX])
    }
  }, [editUser])

  return <>
    <Modal
      prompt={isOpen}
      title="編輯使用者"
      okBtn="確定"
      onOk={handleSubmit(onSubmit)}
      cancelBtn="取消"
      onCancel={() => {closeDlg(); reset()}}
      persistent
    >
      <div className={classReader('w-100')}>
        <div className={classReader('text-title text-required')}>Email</div>
        <Input
          name="email"
          register={register}
          validate={hookFormValidates().email}
          controllerError={errors?.email?.message}
          disabled={Boolean(editUser)}
        />
      </div>
      <div className={classReader('w-100')}>
        <div className={classReader('text-title text-required')}>權限</div>
        <Select
          name="role"
          placeholder="請選擇 Admin / Owner / Agency / Viewer"
          options={[
            {
              label: 'admin',
              value: 'admin',
            },
            {
              label: 'owner',
              value: 'owner',
            },
            {
              label: 'agency',
              value: 'agency',
            },
            {
              label: 'viewer',
              value: 'viewer',
            },
          ]}
          register={register}
          validate={hookFormValidates().role}
          onChange={(name, val) => setValue(name, val)}
          controllerError={errors?.role?.message}
        />
      </div>
    </Modal>

    <Modal
      prompt={isOpenSuccessDlg}
      title="系統通知"
      okBtn="確認"
      onOk={resetAllDlg}
    >
      <p>已寄送開通Email 給使用者，請通知使用者確認Email 信箱</p>
    </Modal>
  </>
}

const DeleteDlg = ({
  closeDlg,
  deleteUser,
  isOpen,
}) => {
  const handleDelete = () => {
    //這個等API 來會整個改寫
    FAKE_DATA = [...FAKE_DATA.slice(0, deleteUser.id), ...FAKE_DATA.slice(deleteUser.id + 1)]
    closeDlg()
  }

  return <Modal
    prompt={isOpen}
    title="系統通知"
    okBtn="確認"
    onOk={handleDelete}
    cancelBtn="取消"
    onCancel={closeDlg}
    reverseBtn={true}
  >
    <p>是否確認刪除{deleteUser?.[NAME_IN_COLUMN_INDEX]}（{deleteUser?.[COMPANY_IN_COLUMN_INDEX]}）？</p>
  </Modal>
}

const ResendDlg = ({
  closeDlg,
  isOpen,
  resendUser,
}) => {
  const [isSending, setIsSending] = useState(true)

  useEffect(() => {
    if (isOpen) {
      setIsSending(true)
      setTimeout(() => {
        setIsSending(false)
      }, 2000)
    }
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
        <p>已重新寄送Email 通知給{resendUser?.[NAME_IN_COLUMN_INDEX]}（{resendUser?.[COMPANY_IN_COLUMN_INDEX]}）</p>
    }
  </Modal>
}

export default Table