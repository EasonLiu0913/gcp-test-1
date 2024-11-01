const express = require('express')
const next = require('next')

const dev = process.env.NEXT_PUBLIC_IS_DEVELOPMENT_ENV === 'false'
const app = next({ dev })
const handle = app.getRequestHandler()

// Your app will get the Azure port from the process.enc.PORT
const port = process.env.PORT || 3000

app.prepare().then(() => {
  const server = express()

  // 解析 POST
  server.use(express.json())

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
}).catch(ex => {
  console.error(ex.stack)
  process.exit(1)
})