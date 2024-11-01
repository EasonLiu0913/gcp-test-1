import { createSlice } from '@reduxjs/toolkit'
import { MENU } from 'config/menu'

const initial = {
  user: {
    id: 0,
    name: '',
    email: '',
    company: '',
    defaultBrandId: 0,
    defaultProjectId: 0,
    defaultProjectName: '',
    defaultProjectBrandDomain: '',
    isTop: false,
  },
  projects: [],
  permissions: {},
  menu: [],
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initial,
  reducers: {
    setUser(state, action) {
      let defaultProjectName = ''
      let defaultProjectBrandDomain = ''
      let brandId = 0
      let permission = { 999: 'RWD' } //一律可以進去的頁面，不用看權限的，設定為999:"RWD"
      const isTop = action.payload?.isTop //系統管理者
      const projects = action.payload?.projects ?? []

      for (let index in projects) {
        if (projects[index].projectId === action.payload?.defaultProjectId) {
          defaultProjectName = projects[index].projectName
          defaultProjectBrandDomain = projects[index].brandDomain
          brandId = projects[index].brandId
          projects[index].permissions.forEach( item => {
            permission[item.pageCode] = isTop ? 'RWD' : item.permissionCode
          })
          break
        }
      }

      let allowedMenu = []
      if (projects.length > 0) {
        MENU.forEach( item => {
          if (item.sub) {
            let allowSub = item.sub.filter( s => {
              return permission[s.id] === 'RWD' || permission[s.id] === 'RW' || permission[s.id] === 'V'
            })
            if (allowSub.length) {
              allowedMenu.push({
                ...item,
                sub: allowSub,
              })
            }
          } else {
            if (permission[item.id] === 'RWD' || permission[item.id] === 'RW' || permission[item.id] === 'V' ) {
              allowedMenu.push(item)
            }
          }
        })
      }

      return {
        user: {
          id: action.payload?.id ?? 0,
          name: action.payload?.name ?? '',
          email: action.payload?.email ?? '',
          company: action.payload?.company ?? '',
          defaultBrandId: brandId,
          defaultProjectId: action.payload?.defaultProjectId ?? 0,
          defaultProjectName: defaultProjectName,
          defaultProjectBrandDomain: defaultProjectBrandDomain,
          isTop: isTop,
          createUserId: action.payload?.createUserId,
        },
        projects: projects,
        permissions: permission,
        menu: allowedMenu,
      }
    },
    removeUser(state) {
      return initial
    },
  },
})


export const selectProjects = (state) => state.user.projects ?? initial.projects
export const selectPermissions = (state) => state.user.permissions ?? initial.permissions
export const selectUser = (state) => state.user.user ?? initial.user
export const selectMenu = (state) => state.user.menu ?? initial.menu

export const { setUser, removeUser } = userSlice.actions
export default userSlice.reducer