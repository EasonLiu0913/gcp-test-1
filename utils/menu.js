import { MENU } from 'config/menu'

export const getDefaultPermission = () => {
  let defaultPermission = {}
  function iterateMenu(menu) {
    if (menu.defaultPermission !== undefined) {
      defaultPermission[menu.id] = menu.defaultPermission
    } else if (menu.sub) {
      menu.sub.map( item => {
        iterateMenu(item)
      })
    }
  }
  MENU.map( item => iterateMenu(item))
  
  return defaultPermission
}