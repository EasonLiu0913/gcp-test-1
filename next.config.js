/** @type {import('next').NextConfig} */
// const nextConfig = {reactStrictMode: true}

/*
  資安弱掃報告必要設定
  1. Content-Security-Policy: 
      「default-src」和「frame-ancestors」原則兩者，*或「* script-src」、「object-src」及「frame-ancestors」原則三者。
      相關說明
        |- default-src: 預設
        |- frame-ancestors: 是否允許 iframe 
        |- script-src: script 允許來源
        |- style-src: style 允許來源
          |- self => 自己，EX : https://example.com/css/main.css
          |- unsafe-inline => 允許 <style>...</style>
        |- img-src: img 允許來源
          |- data: => 允許 <img src="data:image/png;base64,..." />
        |- connect-src: api, ajax 允許來源

  2. Strict-Transport-Security: 
      HTTP Strict Transport Security (HSTS) 這個機制可保護安全的 (HTTPS) 網站不被降級到不安全的 HTTP。
      請務必將 'max-age' 設為夠高的值，以防止提前切換回不安全的連線。
      此處預設 31536000 (1年)
  
  3. X-Content-Type-Options:
      具有 "nosniff" 值的 "X-Content-Type-Options" 標頭可防止 IE 和 Chrome 忽視回應的內容類型。

  https://epos.ctbcbank.com/mFastPay/TxnServlet
  https://travel.hotaigo.com.tw//account/pay?type=card&result=?StatusCode=T0008&StatusDesc=%E5%8D%A1%E7%89%87%E6%96%B0%E5%A2%9E%E5%A4%B1%E6%95%97
*/
const version = [
  0,
  1,
  6,
  4,
].join('.')

// 專案 domain
const webDomain = 'https://*.ourl.tw'

// 和泰集團 - 總部
const groupHeadquarters = 'https://*.hotaimember.com.tw'

/*
  apim
  聯網會使用 apim 對 api root 再包一層，有的話才設置
  目前 apim 預設只用於
  1. apiUrls : api 連線
  2. formUrls : form post / get
*/
const apimRoot = ''

// v4
const apiUrls = [
  // 專案 domain, api domain
  webDomain,
  'https://*.azurewebsites.net',

  // 和泰集團 - 總部
  groupHeadquarters,

  // apim 
  apimRoot,

  // GTM
  'https://*.google-analytics.com',
  'https://*.analytics.google.com',
  'https://*.googletagmanager.com',
  'https://*.g.doubleclick.net',

  // GTM 自定
  'https://t.ssp.hinet.net',
  'https://*.ourl.tw',
  'https://*.ourl.pro',
].join(' ')

const imageUrls = [
  // 專案 domain, api domain
  webDomain,
    
  // 和泰集團 - 總部
  groupHeadquarters,

  // GTM 
  'https://ssl.gstatic.com',
  'https://www.gstatic.com',
  'https://*.google-analytics.com',
  'https://*.analytics.google.com',
  'https://*.googletagmanager.com',
  'https://*.g.doubleclick.net',
  'https://*.fls.doubleclick.net',
  'https://ad.doubleclick.net',

  // GTM 自定
  'https://*.t.ssp.hinet.net',
].join(' ')

const scriptUrls = [
  'https://tagmanager.google.com',
  'https://*.googletagmanager.com',
  'https://www.google-analytics.com',

  // GTM 自定
  'https://t.ssp.hinet.net',
].join(' ')

const styleUrls = [
  'https://tagmanager.google.com',
  'https://*.googletagmanager.com',
  'https://fonts.googleapis.com',
  'http://fonts.googleapis.com',
].join(' ')

const formUrls = [
  // 專案 domain, api domain
  webDomain,
      
  // 和泰集團 - 總部
  groupHeadquarters,

  // apim
  apimRoot,
].join(' ')


// 用於 'unsafe-inline' script, style，產生亂數與CSP規則進行比對，相符則放行，不同則阻擋，以此增加安全性，例如 : <script nonce="${nonce}">...<script>
// const crypto = require('crypto')
// const nonce = crypto.randomBytes(16).toString('base64')

// google GA4 TLD 清單
const googleTLDsString = '.google.com .google.ad .google.ae .google.com.af .google.com.ag .google.al .google.am .google.co.ao .google.com.ar .google.as .google.at .google.com.au .google.az .google.ba .google.com.bd .google.be .google.bf .google.bg .google.com.bh .google.bi .google.bj .google.com.bn .google.com.bo .google.com.br .google.bs .google.bt .google.co.bw .google.by .google.com.bz .google.ca .google.cd .google.cf .google.cg .google.ch .google.ci .google.co.ck .google.cl .google.cm .google.cn .google.com.co .google.co.cr .google.com.cu .google.cv .google.com.cy .google.cz .google.de .google.dj .google.dk .google.dm .google.com.do .google.dz .google.com.ec .google.ee .google.com.eg .google.es .google.com.et .google.fi .google.com.fj .google.fm .google.fr .google.ga .google.ge .google.gg .google.com.gh .google.com.gi .google.gl .google.gm .google.gr .google.com.gt .google.gy .google.com.hk .google.hn .google.hr .google.ht .google.hu .google.co.id .google.ie .google.co.il .google.im .google.co.in .google.iq .google.is .google.it .google.je .google.com.jm .google.jo .google.co.jp .google.co.ke .google.com.kh .google.ki .google.kg .google.co.kr .google.com.kw .google.kz .google.la .google.com.lb .google.li .google.lk .google.co.ls .google.lt .google.lu .google.lv .google.com.ly .google.co.ma .google.md .google.me .google.mg .google.mk .google.ml .google.com.mm .google.mn .google.com.mt .google.mu .google.mv .google.mw .google.com.mx .google.com.my .google.co.mz .google.com.na .google.com.ng .google.com.ni .google.ne .google.nl .google.no .google.com.np .google.nr .google.nu .google.co.nz .google.com.om .google.com.pa .google.com.pe .google.com.pg .google.com.ph .google.com.pk .google.pl .google.pn .google.com.pr .google.ps .google.pt .google.com.py .google.com.qa .google.ro .google.ru .google.rw .google.com.sa .google.com.sb .google.sc .google.se .google.com.sg .google.sh .google.si .google.sk .google.com.sl .google.sn .google.so .google.sm .google.sr .google.st .google.com.sv .google.td .google.tg .google.co.th .google.com.tj .google.tl .google.tm .google.tn .google.to .google.com.tr .google.tt .google.com.tw .google.co.tz .google.com.ua .google.co.ug .google.co.uk .google.com.uy .google.co.uz .google.com.vc .google.co.ve .google.co.vi .google.com.vn .google.vu .google.ws .google.rs .google.co.za .google.co.zm .google.co.zw .google.cat'
const googleTLDs = `https://*${googleTLDsString.split(' ').join(' https://*')}`

/* 
  測試專用白名單，正式機中不列入
  注意事項:
    1. 此處只列舉與 localhost/SIT/UAT 相關系統 domain
    2. 測試環境 domain 請勿使用*來進行匹配，避免安全性問題產生
    3. 專案 PROD URL 更動時，請務必修改 testUrls 判斷，確保測試條件只存在於測試環境
    
    EX: process.env.NEXT_PUBLIC_HOTAIGO_URL === 'PROD URL'
*/
const testUrls = process.env.NEXT_PUBLIC_HOTAIGO_URL === 'https://cms.ourl.tw/' ? '' : [
  // SIT/UAT 登入跳轉
  '',
].join(' ')

const csp = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' ${scriptUrls} ${testUrls}; 
  style-src 'self' 'unsafe-inline' data: ${styleUrls} ${testUrls};
  style-src-attr 'self' 'unsafe-inline' data: ${styleUrls} ${testUrls};
  style-src-elem 'self' 'unsafe-inline' data: ${styleUrls} ${testUrls};
  img-src 'self' 'unsafe-inline' data: *;
  font-src data: https://fonts.gstatic.com http://fonts.gstatic.com;
  connect-src 'self' ${apiUrls} ${googleTLDs} ${testUrls};
  frame-src https://bid.g.doubleclick.net https://*.fls.doubleclick.net https://td.doubleclick.net/;
  form-action 'self' ${formUrls} ${testUrls};
  worker-src 'self' blob:;
  base-uri 'self';
  object-src 'none';
`

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: csp.replace(/\s{2,}/g, ' ').trim(),
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // {
  //   key: 'X-Frame-Options',
  //   value: 'DENY'
  // },
  // {
  //   key: 'Permissions-Policy',
  //   value: 'camera=(); battery=(); geolocation=(); microphone=()'
  // },
  // {
  //   key: 'Referrer-Policy',
  //   value: 'no-referrer-when-downgrade',
  // },
]

// module.exports = nextConfig
const path = require('path')
const nextConfig = {
  /*
    Next.js provides gzip compression to compress rendered content and static files. 
    Enable => compress: true
  */
  compress: true,

  // test 暫時不開
  // https://learn.microsoft.com/zh-tw/azure/static-web-apps/deploy-nextjs-hybrid
  // https://nextjs.org/docs/pages/api-reference/next-config-js/output
  // output: 'standalone',
  env: {
    version: `v ${version}`,
    // nonce: nonce,
  },
  // reactStrictMode: true, // next 13 與 react 18 會有衝突，導致頁面渲染兩次(造成開啟 API 會打兩次)
  swcMinify: true,
  // Adding policies
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      // {
      //   source: '/api/(.*)', // 针对 API 路径的设置
      //   headers: [
      //     {
      //       key: 'Content-Security-Policy',
      //       value: csp.replace(/\s{2,}/g, ' ').trim(), // 修改为仅限制为自身源
      //     },
      //   ],
      // },
    ]
  },
  exportPathMap: async function (defaultPathMap,
    {
      dev, dir, outDir, distDir, buildId,
    }) {
    return {}
  },
  images: {
    unoptimized: true,
    // minimumCacheTTL: 15
  },
  sassOptions: { includePaths: [path.join(__dirname, 'styles')] },
}

module.exports = nextConfig