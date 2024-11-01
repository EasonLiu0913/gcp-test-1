export const WEB_TITLE = 'OmniU | 品牌短網址'
export const TAB_TITLE_SUFFIX = ` - ${WEB_TITLE}`

export const HEAD_DEFAULT_DATA = {
  TITLE: WEB_TITLE, 
  DESC: '透過短連結的客製化，讓消費者一眼看出品牌跟廣告標的，增加連結點擊率，進而豐富興趣輪廓。',
  URL: process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URL,
  IMAGE: `${process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URL}fb-share.png`,
  TYPE: 'website',
  ICON: `${process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URL}favicon/favicon.ico`,
  APPLE_ICON: `${process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URL}favicon/favicon_196x196.png`,
}