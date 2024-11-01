import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import classReader from 'utils/classReader'
import { TAB_TITLE_SUFFIX } from 'config/head'
import Button from 'common/Button'
import { useRouter } from 'next/router'

const Custom404 = (props) => {
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  return (
    <>
      <Head>
        <title>{`404${TAB_TITLE_SUFFIX}`}</title>
        <meta name="description" content={`404${TAB_TITLE_SUFFIX}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="googlebot" content="noindex,nofollow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={classReader({ Custom404Style: ['main'] }, 'd-flex flex-column justify-content-center align-items-center')}>

        {/* 因 console 報錯警告 fetchPriority，故此處不使用 nextJS Image */}
        {/* <Image src="/404/errorimg.svg" alt="" width={360} height={360} priority /> */}
        <img src="/404/errorimg.svg" width={360} height={360} alt="" className={classReader('mr-2')} />
       
        <h2 className={classReader('h2 m-0')}>Opps!!!</h2>
        <p className={classReader('pt-1 mb-5')}>此頁面不存在</p>
        <Button
          className={classReader('px-3')}
          onClick={() => {
            setIsRedirecting(true)
            router.replace('/dashboard')}
          }
          isLoading={isRedirecting}
        >回到首頁</Button>
      </main>
    </>
  )
}

Custom404.propTypes = {}
export default Custom404