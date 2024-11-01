import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import classReader from 'utils/classReader'
import { useRouter } from 'next/router'
import Button from 'common/Button'
import { OAUTH } from 'config/config'
import memberAPI from 'apis/member'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectUser,
  selectProjects,
  removeUser, 
} from 'slices/userSlice'
import { useError } from 'context/ErrorContext'
import Cookies from 'js-cookie'
import { ERROR_CODE_LABEL } from 'config/error'

const UserInfo = ({ navOption }) => {
  const projects = useSelector(selectProjects)
  console.log('UserInfo ~ projects:', projects)
  const user = useSelector(selectUser)
  const dispatch = useDispatch()
  const [isSwitchingProject, setIsSwitchingProject] = useState(false)
  const router = useRouter()
  const { reportError } = useError()

  const handleLogout = async () => {
    try {
      await memberAPI.logout()
    } catch (err) {
      // reportError(err)
    } finally {
      Cookies.remove(OAUTH.TOKEN)
      router.push('/login')
      dispatch(removeUser())
    }
  }

  const handleSwitchProject = async (projectId) => {
    //目前的專案，不可切換
    if (projectId === user.defaultProjectId || isSwitchingProject) return
    setIsSwitchingProject(true)
    try {
      const result = await memberAPI.switchProject({ projectId: projectId })
      if (!result.success) {
        // throw result
        reportError({ errorNo: ERROR_CODE_LABEL[result.errorNo || 9999] })
      }
      Cookies.set(OAUTH.TOKEN, result.data)
      return location.href = '/dashboard'
    } catch (err) {
      setIsSwitchingProject(false)
      reportError(err)
    }
  }

  return (
    <div className={classReader('user-info')}>
      <div className={classReader('user-info__main')}>
        <div className={classReader('public-padding pt-2 pb-2 ')}>

          <div className={classReader('user-info__basic pt-2 pb-2')}>
            <div className={classReader('pt-2 pb-2')}>
              <label className={classReader('h4')}><b>使用者資料</b></label>
            </div>
            <div className={classReader('w-100 p-2')}>
              <label className={classReader('d-block mb-1 h6')}>{user.name}</label>
              <small className={classReader('d-block gray-6')}>{user.email}</small>
              {user.isTop && <small className={classReader('d-block red mt-1')}>系統管理員</small>}
            </div>
          </div>

          {navOption && <div className={classReader('user-info__nav pt-2 pb-2 border-top border-bottom')}>
            {navOption.map((item, index) => <div key={index}>
              <Link prefetch={false} href={item.link} passHref>
                <div className={classReader('user-info__nav__item d-flex align-items-center pt-2 pb-2')}>
                  <div className={classReader('user-info__nav__item__icon d-flex align-items-center justify-content-center icon-xl rounded-8')}>
                    <i className={classReader(`icon icon-${item.icon} icon-primary icon-md`)}/>
                  </div>
                  <label className={classReader('ml-3 cursor-pointer')}>{item.label}</label>
                </div>
              </Link>
            </div>)}
          </div>}
          
          <div className={classReader('user-info__project pt-2 pb-2')}>
            <div className={classReader('pt-2 pb-2')}>
              <label><b>現有專案</b></label>
            </div>
            <div className={classReader('user-info__project__menu scrollbar-y')}>
              {projects.length === 0 && <div className={classReader('p-3')}>成員尚未加入專案</div>}
              {projects.map((item, index) => {
                const onProject = user.defaultProjectId === item.projectId
                return <div key={index} className={classReader('user-info__project__item d-flex align-items-center justify-content-between w-100 rounded-8')}>
                  <div className={classReader('d-flex align-items-center p-2')}>
                    <i className={classReader(`icon icon-point icon-${onProject ? 'success' : 'gray-6'} mt-1 mr-1`)}/>
                    <div>
                      <label className={classReader('d-block mb-1')}>{item.brandName}</label>
                      <small className={classReader('d-block gray-6')}>{item.roleName}</small>
                    </div>
                  </div>
                  <Button
                    className={classReader('m-0 pt-1 pb-1 pl-4 pr-4 mr-2', { 'cursor-default': onProject })}
                    type="button"
                    label={onProject ? '目前' : '切換'}
                    color="primary"
                    textColor={onProject ? 'white' : 'primary'}
                    size="sm"
                    outline={!onProject}
                    rounded
                    onClick={() => handleSwitchProject(item.projectId)}
                    isLoading={isSwitchingProject}
                    closeAnimate={onProject}
                  />
                </div>
              })}
            </div>

          </div>

        </div>
        <div className={classReader('user-info__logout public-padding pt-4 pb-4')}>
          <Button
            className={classReader('m-0 w-100')}
            type="button"
            label="登出"
            color="primary"
            textColor="primary"
            outline
            icon="power"
            onClick={handleLogout}
          />
        </div>
      </div>
     
    </div>
  )
}

UserInfo.propTypes = { navOption: PropTypes.array }

export default UserInfo