import { NextResponse } from 'next/server'

export function middleware(request) {
  // 獲取原始 response
  const response = NextResponse.next()

  // 在 response headers 中添加環境變數
  response.headers.set('x-my-env', process.env.NEXT_PUBLIC_MY_TEST_STRING_3 || 'hi')

  return response
}

// 配置哪些路徑需要執行 middleware
export const config = { matcher: '/:path*' } 
