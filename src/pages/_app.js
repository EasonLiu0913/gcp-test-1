import React from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Provider } from 'react-redux'
import store from 'store'
import { SnackbarProvider } from 'notistack'
import { HEAD_DEFAULT_DATA } from 'config/head'
import 'styles/base/normalize.css'
import RouteProtection from 'page-components/RouteProtection'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import Loading from 'common/Loading'
import { ErrorProvider } from 'context/ErrorContext'

const App = ({ Component, pageProps }) => {
  const router = useRouter()
  const layout = Component.layout || ((page) => page)
  const canonical = `${HEAD_DEFAULT_DATA.URL}${router.asPath.replace(/^\//, '')}`

  return <Provider store={store}>

    <SnackbarProvider autoHideDuration={3000}>
      <ErrorProvider>
        {
          layout(<>
            <Head>
              <title>{HEAD_DEFAULT_DATA.TITLE}</title>
              <meta name="description" content={HEAD_DEFAULT_DATA.DESC} />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <link rel="icon" href="/favicon/favicon_16x16.png" sizes="16x16" />
              <link rel="icon" href="/favicon/favicon_32x32.png" sizes="32x32" />
              <link rel="icon" href="/favicon/favicon_96x96.png" sizes="96x96" />
              <link rel="icon" href="/favicon/favicon_128x128.png" sizes="128x128" />
              <link rel="icon" href="/favicon/favicon_196x196.png" sizes="196x196" />
              <link rel="icon" href="/favicon/favicon_256x256.png" sizes="256x256" />
              <link rel="canonical" href={canonical} />
            </Head>
        
            <RouteProtection>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Component {...pageProps}/>
              </LocalizationProvider>
            </RouteProtection>
            <Loading />
          </>)
        }
      </ErrorProvider>
    </SnackbarProvider>

  </Provider>
}
export default App