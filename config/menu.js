// 權限分別為 RWD / RW / V / BAN
// 注意！這裡的資料要和後端對齊，如有修改要通知後端

import { display } from '@mui/system'

// 開新的MENU 要記得同時修改 domainPermission
export const MENU = [
  {
    id: '101',
    display: 'Dashboard',
    link: '/dashboard',
    icon: 'dashboard',
    defaultPermission: 'RWD',
    isPermissionsFixed: true,
  },
  {
    id: '200',
    display: '權限管理',
    name: 'permission',
    icon: 'key',
    link: '/permission',
    sub: [
      {
        id: '201',
        display: '角色權限管理',
        link: '/permission/role',
        defaultPermission: 'BAN',
      },
      {
        id: '202',
        display: '商品方案管理',
        link: '/permission/plan',
        defaultPermission: 'BAN',
      },
      {
        id: '203',
        display: '品牌網域管理',
        link: '/permission/brand',
        defaultPermission: 'BAN',
      },
      {
        id: '204',
        display: '申請單管理',
        link: '/permission/application',
        defaultPermission: 'BAN',
      },
      {
        id: '205',
        display: '所有使用者管理',
        link: '/permission/allUser',
        defaultPermission: 'BAN',
      },
      {
        id: '206',
        display: '使用者管理',
        link: '/permission/user',
        defaultPermission: 'RWD',
      },
    ],
  },
  {
    id: '300',
    display: '建立短網址',
    icon: 'dns',
    link: '/shortener',
    sub: [
      {
        id: '301',
        display: '單一短網址',
        link: '/shortener/manage',
        defaultPermission: 'RWD',
      },
      {
        id: '302',
        display: '量產短網址',
        link: '/shortener/batch',
        defaultPermission: 'RWD',
      },
      {
        id: '303',
        display: '1:1個人化',
        link: '/shortener/one-on-one',
        defaultPermission: 'RWD',
      },
      {
        id: '304',
        display: '1:1自定義',
        link: '/shortener/parameters',
        defaultPermission: 'RWD',
      },
    ],
  },
  {
    id: '400',
    display: '數據分析',
    name: 'analysis',
    icon: 'monitoring',
    link: '/analysis',
    sub: [
      {
        id: '401',
        display: '成效分析',
        name: 'effect',
        link: '/analysis/effect',
        defaultPermission: 'RWD',
      },
      {
        id: '402',
        display: '受眾分析',
        name: 'audience',
        link: '/analysis/audience',
        defaultPermission: 'RWD',
        hidden: true,
      },
    ],
  },
]

// minPermission 代表這個路徑最少需要什麼權限
// 通常都是V，如果是新增、編輯頁，需要到RW
// 如果是一律可以進去的頁面（如修改個人資料頁）設定為 { id: '999', minPermission: 'OPEN'}
export const DOMAIN_PERMISSION = {
  '/dashboard': {
    id: '101',
    minPermission: 'V',
  },
  '/permission/role': {
    id: '201',
    minPermission: 'V',
  },
  '/permission/role/create': {
    id: '201',
    minPermission: 'RW',
  },
  '/permission/role/edit/[id]': {
    id: '201',
    minPermission: 'RW',
  },
  '/permission/plan': {
    id: '202',
    minPermission: 'V',
  },
  '/permission/plan/create': {
    id: '202',
    minPermission: 'RW',
  },
  '/permission/brand': {
    id: '203',
    minPermission: 'V',
  },
  '/permission/brand/create': {
    id: '203',
    minPermission: 'RW',
  },
  '/permission/brand/edit/[id]': {
    id: '203',
    minPermission: 'RW',
  },
  '/permission/application': {
    id: '204',
    minPermission: 'V',
  },
  '/permission/allUser': {
    id: '205',
    minPermission: 'V',
  },
  '/permission/user': {
    id: '206',
    minPermission: 'V',
  },
  '/shortener/manage': {
    id: '301',
    minPermission: 'V',
  },
  '/shortener/manage/create': {
    id: '301',
    minPermission: 'RW',
  },
  '/shortener/manage/create/finish': {
    id: '301',
    minPermission: 'RW',
  },
  '/shortener/manage/edit/[id]': {
    id: '301',
    minPermission: 'RW',
  },
  '/shortener/manage/edit/finish': {
    id: '301',
    minPermission: 'RW',
  },
  '/shortener/batch': {
    id: '302',
    minPermission: 'V',
  },
  '/shortener/batch/create': {
    id: '302',
    minPermission: 'RW',
  },
  '/shortener/batch/create/finish': {
    id: '302',
    minPermission: 'RW',
  },
  '/shortener/batch/list/[id]': {
    id: '302',
    minPermission: 'V',
  },
  '/shortener/batch/list/edit/[id]': {
    id: '302',
    minPermission: 'RW',
  },
  '/shortener/batch/list/edit/finish': {
    id: '302',
    minPermission: 'RW',
  },
  '/shortener/one-on-one': {
    id: '304',
    minPermission: 'V',
  },
  '/shortener/one-on-one/create': {
    id: '304',
    minPermission: 'RW',
  },
  '/shortener/one-on-one/create/finish': {
    id: '304',
    minPermission: 'RW',
  },
  '/shortener/one-on-one/edit/[id]': {
    id: '304',
    minPermission: 'RW',
  },
  '/shortener/one-on-one/edit/finish': {
    id: '304',
    minPermission: 'RW',
  },
  '/shortener/parameters': {
    id: '304',
    minPermission: 'V',
  },
  '/shortener/parameters/create': {
    id: '304',
    minPermission: 'RW',
  },
  '/shortener/parameters/create/finish': {
    id: '304',
    minPermission: 'RW',
  },
  '/shortener/parameters/edit/[id]': {
    id: '304',
    minPermission: 'RW',
  },
  '/shortener/parameters/edit/finish': {
    id: '304',
    minPermission: 'RW',
  },
  '/analysis/effect': {
    id: '401',
    minPermission: 'V',
  },
  '/analysis/effect/detail/[id]': {
    id: '401',
    minPermission: 'V',
  },
  '/analysis/audience': {
    id: '402',
    minPermission: 'V',
  },
  '/analysis/audience/detail/[code]': {
    id: '402',
    minPermission: 'V',
  },
  '/analysis/audience/label/[id]': {
    id: '999',
    minPermission: 'V',
  },
  '/analysis/audience/related/[id]': {
    id: '999',
    minPermission: 'V',
  },
  '/setting': {
    id: '999',
    minPermission: 'OPEN',
  },
}