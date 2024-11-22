export default function handler(req, res) {
  const origin = req.headers.origin
  const referer = req.headers.referer
  
  // 允許的域名列表
  const allowedOrigins = ['https://gcp-test-1-342251465384.asia-east1.run.app', 'http://localhost:3000']

  // 如果有 origin，檢查是否在允許列表中
  // if (origin && !allowedOrigins.includes(origin)) {
  //   return res.status(403).json({ error: 'Forbidden - Invalid Origin' })
  // }

  // // 如果沒有 origin 但有 referer，檢查 referer
  // if (!origin && referer) {
  //   const refererUrl = new URL(referer)
  //   if (!allowedOrigins.includes(refererUrl.origin)) {
  //     return res.status(403).json({ error: 'Forbidden - Invalid Referer' })
  //   }
  // }

  // // 如果既沒有 origin 也沒有 referer，拒絕請求
  // if (!origin && !referer) {
  //   return res.status(403).json({ error: 'Forbidden - No Origin/Referer' })
  // }

  // // 設置 CORS header（如果有 origin）
  // if (origin && allowedOrigins.includes(origin)) {
  //   res.setHeader('Access-Control-Allow-Origin', origin)
  // }
  
  // 返回環境變數
  res.status(200).json({ myEnv: referer || 'hi' })
} export default function handler(req, res) {
  // 檢查請求來源
  const origin = req.headers.origin
  console.log('origin', origin)
  
  // 只允許特定域名訪問，請替換成你的網站域名
  // if (origin !== 'https://gcp-test-1-342251465384.asia-east1.run.app') {
  //   return res.status(403).json({ error: 'Forbidden' })
  // }

  // 設置 CORS header
  // res.setHeader('Access-Control-Allow-Origin', 'https://gcp-test-1-342251465384.asia-east1.run.app')
  
  // 返回環境變數
  res.status(200).json({ myEnv: origin || 'no origin' })
} 
