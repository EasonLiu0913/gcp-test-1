import {
  Html,
  Head,
  Main,
  NextScript, 
} from 'next/document'
import classReader from 'utils/classReader'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className={classReader('body')}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
