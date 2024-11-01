import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Button from 'common/Button'
import classReader from 'utils/classReader'
import { handleHeadParams } from 'utils/util'
import { handleInTime } from 'utils/date'
import { WEBSITE_MAINTENANCE_DATE } from 'config/date'

export async function getServerSideProps(context) {
  const headParams = handleHeadParams(context)

  return { props: { ...headParams } }
}

// 置頂維修公告
const maintenanceStatus = handleInTime(
  WEBSITE_MAINTENANCE_DATE.start,
  WEBSITE_MAINTENANCE_DATE.end,
  WEBSITE_MAINTENANCE_DATE.transitionSeconds.start,
  0,
)

const Maintenance = ({ pathQuery }) => {
  const router = useRouter()

  useEffect(() => {
    if (!maintenanceStatus) {
      router.push({
        pathname: '/',
        query: pathQuery,
      })
    }
  }, [])
  
  return (
    <>
      <Head>
        <title>系統正在維護中</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="googlebot" content="noindex,nofollow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {maintenanceStatus && (
        <main className={classReader({ Custom404Style: ['main'] }, 'd-flex flex-column justify-content-center align-items-center')}>
          <Image 
            src="/maintenance/maintenance2.svg" 
            alt=""
            width={360}
            height={360}
            priority
          />
          <h2 className={classReader('h2 m-0')}>頁面維修中!!!</h2>
          <p className={classReader('pt-1')}>目前系統正在進行維修，請耐心等待。</p>
          
          <Button 
            className={classReader('m-0 mt-3 mb-5')}
            type="button"
            label="回到登入頁面"
            color="primary"
            textColor="white"
            onClick=""
          />
        </main>
      )}
    </>
  )
}

Maintenance.propTypes = {}
export default Maintenance