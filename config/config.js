export const IS_DEVELOPMENT_ENV = process.env.NEXT_PUBLIC_IS_DEVELOPMENT_ENV == 'true'
export const UI_VIEW = process.env.NEXT_PUBLIC_UI_VIEW === 'true'
export const SHOW_CONSOLE = process.env.NEXT_PUBLIC_CONSOLE === 'true'

export const ENV_INFO = { 
  version: process.env.version,
  apiRoot: 'https://branddomain-backend-uat.azurewebsites.net/api', 
}

export const OAUTH = {
  TOKEN: 'jwt',
  // CODE_VERIFIER: 'codeVerifier',
  // PROFILE_REFRESH: 'profileRefresh',
  // STASH_PATH_NAME: 'stashPathName',
}

export const APP_ID = 'BrandDomainCMS'
export const CRYPTO_TYPE = 'S256'
export const OAUTH_GRANT_TYPE = 'authorization_code'

export const LOCAL_STORAGE = {
  // PERSIST_ROOT: 'persist:root',
  TOKEN: 'jwt',
  CODE_VERIFIER: 'codeVerifier',
  PROFILE_REFRESH: 'profileRefresh',
  STASH_PATH_NAME: 'stashPathName',
}

export const USE_FORM_CONFIG = {
  shouldFocusError: false,
  mode: 'onBlur',
  reValidateMode: 'onBlur',
  criteriaMode: 'all',
}

export const ROLE_MAPPING = {
  1: 'admin',
  2: 'manager',
  3: 'employee',
  4: 'other',
}

export const STATUS = {
  0: '未啟用',
  1: '啟用',
}