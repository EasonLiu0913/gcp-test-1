import CommonStyle from 'styles/utils/common/common.module.scss'
import LoginStyle from 'styles/pages/login.module.scss'

// 404
import Custom404Style from 'styles/pages/custom404.module.scss'
// 維護頁
import Maintenance from 'styles/pages/maintenance.module.scss'
// UI
import UIStyle from 'styles/pages/ui.module.scss'
import ShortenerStyle from 'styles/pages/shortener.module.scss'
import PermissionStyle from 'styles/pages/permission.module.scss'
import AnalysisStyle from 'styles/pages/analysis.module.scss'
import Dashboard from 'styles/pages/dashboard.module.scss'

export const styleSwitch = {
  CommonStyle: CommonStyle,
  UIStyle: UIStyle,
  Custom404Style: Custom404Style,
  Maintenance: Maintenance,
  LoginStyle: LoginStyle,
  PermissionStyle: PermissionStyle,
  ShortenerStyle: ShortenerStyle,
  AnalysisStyle: AnalysisStyle,
  DashboardStyle: Dashboard,
}

export const styleList = {
  CommonStyle: 'CommonStyle',
  UIStyle: 'UIStyle',
  Custom404Style: 'Custom404Style',
  Maintenance: 'Maintenance',
  LoginStyle: 'LoginStyle',
  PermissionStyle: PermissionStyle,
  ShortenerStyle: 'ShortenerStyle',
  AnalysisStyle: 'AnalysisStyle',
  DashboardStyle: 'Dashboard',
}
