import React, {
  useState, useEffect, Fragment, 
} from 'react'
import classReader from 'utils/classReader'
import Input from 'common/form/Input'
import CardSection from 'common/card/CardSection'
import Select from 'common/form/Select'
import Badge from 'common/Badge'
import Modal from 'common/Modal'
import Button from 'common/Button'
import { USE_FORM_CONFIG } from 'config/config'
import { useForm } from 'react-hook-form'
import roleAPI from 'apis/role'
import { useError } from 'context/ErrorContext'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { hookFormValidates } from 'utils/hookFormValidates'

const PermissionInfo = () => {
  const [roleList, setRoleList] = useState([])
  const [users, setUsers] = useState([])
  const dispatch = useDispatch()
  const { reportError } = useError()
  const router = useRouter()

  const {
    register, handleSubmit, formState: { errors }, reset, setValue,
  } = useForm({
    ...USE_FORM_CONFIG
    , defaultValues: {
      email: '',
      name: '',
      role: 'admin',
    },
  })

  const onSubmit = (data) => {
    reset()
  }

  const handleDelete = (index) => {
    // handleDeleteUser(index)
  }

  const getRoleSelectList = async () => {
    dispatch({ type: 'loading/openLoading' })
    try {
      const result = await roleAPI.getRoleSelectList()
      if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })
      const roles = result.data.map( role => {
        return {
          label: role.value,
          value: role.key,
        }
      })
      setRoleList(roles)
    } catch (err) {
      err.message = '讀取角色權限資料失敗，請稍候再試'
      reportError(err)
      await router.replace('/permission/brand')
    } finally {
      dispatch({ type: 'loading/closeLoading' })
    }
  }

  useEffect(() => {
    getRoleSelectList()
  }, [])

  return (
    <CardSection className={classReader('')}>
      <div className={classReader('h5 bold px-2')}>權限設置</div>
      
      <div className={classReader('px-2')}>
        <div className={classReader('border-top mt-3 mb-3')}></div>
      </div>

      <div className={classReader('row')}>
        <div className={classReader('col-12 col-md-4')}>
          <div className={classReader('px-2')}>
            <div className={classReader('text-title text-required')}>姓名</div>
            <Input
              name="name"
              register={register}
              validate={hookFormValidates().name}
              controllerError={errors?.name?.message}
            />
          </div>
        </div>

        <div className={classReader('col-12 col-md-4')}>
          <div className={classReader('px-2')}>
            <div className={classReader('text-title text-required')}>Email</div>
            <Input
              name="email"
              register={register}
              validate={hookFormValidates().email}
              controllerError={errors?.email?.message}
            />
          </div>
        </div>

        <div className={classReader('col-12 col-md-4')}>
          <div className={classReader('px-2')}>
            <div className={classReader('text-title')}>角色權限</div>
            <Select
              name="role"
              options={roleList}
              register={register}
              onChange={(name, val) => setValue(name, val)}
            />
          </div>
        </div>
      </div>

      <div className={classReader('row mb-5')}>
        <div className={classReader('col-12 col-md-4')}>
          <div className={classReader('px-2')}>
            <Button
              className={classReader('m-0')}
              color="green"
              label="新增"
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </div>
      </div>
      <UserTable users={users} handleDelete={handleDelete}/>

    </CardSection>
  )
}

const UserTable = ({
  users = [],
  handleDelete = () => {},
}) => {

  const [deleteDlgData, setDeleteDlgData] = useState(undefined)

  const onDelete = () => {
    reportError({ message: '刪除成功（未實作）' })
    // handleDelete(deleteDlgData.index)
    setDeleteDlgData(undefined)
  }

  return <>
    <div className={classReader('px-2', { PermissionStyle: 'brand-management__user-table' })}>
      <div className={classReader('text-secondary')}>姓名</div>
      <div className={classReader('text-secondary')}>Email</div>
      <div className={classReader('text-secondary text-center')}>權限角色</div>
      <div className={classReader('text-secondary text-center')}>成員狀態</div>
      <div className={classReader('text-secondary text-center')}>刪除</div>
      {
        users.map( (user, index) => <Fragment key={user.name}>
          <div className={classReader('d-flex align-items-center')}>{user.name}</div>
          <div className={classReader('d-flex align-items-center', { PermissionStyle: 'table__word-break' })}>{user.email}</div>
          <div className={classReader('d-flex flex-center')}>{user.role}</div>
          <div className={classReader('d-flex flex-center')}>{
            user.status === 2 ?
              <Badge className={classReader('px-3')} color="gray-6" rounded>離職</Badge> :
              user.status === 1 ?
                <Badge className={classReader('px-3')} color="green" rounded>啟用</Badge> :
                user.status === 0 ?
                  <Badge className={classReader('px-3')} color="gray-6" rounded>停用</Badge> : <></>
          }</div>
          <div className={classReader('d-flex flex-center p-0')}>
            <div className={classReader('bg-red m-1 p-1 p-xl-2 rounded cursor-pointer')}
              onClick={() => {setDeleteDlgData({
                ...user,
                index,
              })}}>
              <i className={classReader('icon icon-delete icon-sm icon-white')} />
            </div>
          </div>
        </Fragment>)
      }
    </div>

    <Modal
      prompt={Boolean(deleteDlgData)}
      okBtn="刪除"
      onOk={onDelete}
      onCancel={() => setDeleteDlgData(undefined)}
      cancelBtn="取消"
    >
      <p className={classReader('text-center')}>
        你確定要刪除{deleteDlgData?.name}？
      </p>
    </Modal>
  </>
}

export default PermissionInfo