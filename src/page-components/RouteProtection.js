import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import memberAPI from 'apis/member'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectPermissions, setUser, selectUser, removeUser,
} from 'slices/userSlice'
import { DOMAIN_PERMISSION, MENU } from 'config/menu'
import { useError } from 'context/ErrorContext'
import { NON_LOGIN_REQUIRED_DOMAIN } from 'config/router'
import {
  NO_PROJECT_ERROR_MSG,
  NO_PROJECT_ERROR_NO_LIST,
  PROJECT_NO_PREMISSIONS_ERROR_MSG,
} from 'config/error'
import Cookies from 'js-cookie'
import { OAUTH, ENV_INFO } from 'config/config'

const nonLoginRequiredDomainRegex = RegExp(NON_LOGIN_REQUIRED_DOMAIN.join('|'))

export default function RouteProtect({ children }) {
  const [myEnv, setMyEnv] = useState(null)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [errDlgMsg, setErrDlgMsg] = useState('')
  const { reportError } = useError()
  const dispatch = useDispatch()
  const router = useRouter()
  const permissions = useSelector(selectPermissions)
  const user = useSelector(selectUser)

  const getUser = async () => {
    try {
      const result = await memberAPI.getUser()
      if (result.success) dispatch(setUser(result.data ?? {}))
      else reportError({ errorNo: 14 })
    } catch (err) {
      setIsAuthorized(false)
      reportError(err)
      // 未加入任何專案，顯示相關文字訊息
      if (NO_PROJECT_ERROR_NO_LIST.includes(err.errorNo)) {
        setErrDlgMsg(NO_PROJECT_ERROR_MSG)
        dispatch(removeUser())
      }
    }
  }

  useEffect(() => {
    fetch('/api/env')
      .then(res => res.json())
      .then(data => {
        setMyEnv(data.myEnv)
        console.log('myEnv from api', data.myEnv)
      })
  }, [])

  useEffect(() => {
    console.log(ENV_INFO.version) // 顯示版本號
  }, [])

  //set user data(with permissions) in redux
  useEffect(() => {
    if (!router.isReady) return
    if (nonLoginRequiredDomainRegex.test(router.pathname)) return setIsAuthorized(true)

    const token = Cookies.get(OAUTH.TOKEN)

    if (token === undefined) {
      reportError({ errorNo: 13 })
      return
    }

    getUser()
  }, [router.isReady, router.asPath])

  useEffect(() => {
    setIsAuthorized(false)
    if (nonLoginRequiredDomainRegex.test(router.pathname)) return setIsAuthorized(true)
    if (!router.isReady || !Object.keys(permissions).length) return

    const domainPermissionInfo = DOMAIN_PERMISSION[router.pathname]
    let result = false

    if (domainPermissionInfo) {
      const permission = permissions[domainPermissionInfo.id]
      switch (domainPermissionInfo.minPermission) {
      case 'V':
        if ([
          'RWD',
          'RW',
          'V',
        ].includes(permission)) result = true
        break
      case 'RW':
        if (['RWD', 'RW'].includes(permission)) result = true
        break
      case 'RWD':
        if (['RWD'].includes(permission)) result = true
        break
      case 'OPEN':
        result = true
        break
      default:
      }

      if (router.pathname !== '/dashboard' && permission === 'BAN') {
        // 2024-06-14 與 TPM Dennis 討論決議兩者都開
        router.push('/dashboard')
        setErrDlgMsg(PROJECT_NO_PREMISSIONS_ERROR_MSG)
      }
      else setErrDlgMsg(NO_PROJECT_ERROR_MSG)

    }

    setIsAuthorized(result)
  }, [permissions])

  return isAuthorized ? children : errDlgMsg
}
