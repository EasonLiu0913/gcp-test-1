export default function handler(req, res) {
  // 檢查請求來源
  const origin = req.headers.origin
  
  // 只允許特定域名訪問，請替換成你的網站域名
  if (origin !== 'https://your-website.com') {
    return res.status(403).json({ error: 'Forbidden' })
  }

  // 設置 CORS header
  res.setHeader('Access-Control-Allow-Origin', 'https://your-website.com')
  
  // 返回環境變數
  res.status(200).json({ myEnv: process.env.MY_TEST_STRING_3 || 'hi' })
} 
