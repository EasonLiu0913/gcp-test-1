import React, { useState, useEffect } from 'react'
import classReader from 'utils/classReader'
import Button from 'common/Button'
import QRCode, { downloadSVG, downloadPNG } from 'common/QRCode'
import { useRouter } from 'next/router'
import { useError } from 'context/ErrorContext'
import { useSnackbar } from 'notistack'
import { textCopy } from 'utils/util'

const FormFinish = ({ isEditMode }) => {

  const router = useRouter()
  const [url, setUrl] = useState('')
  const [batchId, setBatchId] = useState('')
  const { reportError } = useError()
  const { enqueueSnackbar } = useSnackbar()

  const handleDownloadPNG = () => {
    try {
      downloadPNG(router.query.url)
    } catch {
      reportError({ message: '生成PNG檔失敗' })
    }
  }

  const handleDownloadSVG = () => {
    try {
      downloadSVG(router.query.url)
    } catch {
      reportError({ message: '生成SVG檔失敗' })
    }
  }

  const handleCopy = async (value) => {
    const data = await textCopy(value, '複製短網址Url')
    enqueueSnackbar(data.message, { className: classReader(data.className) })
  }

  useEffect(() => {
    if (router.query.url) {
      setUrl(router.query.url)
      setBatchId(router.query.batchId)
    }
  }, [router.isReady])

  return (
    <div className={classReader('text-center', { ShortenerStyle: 'create-form' })}>
      <div className={classReader('pb-3 h5 bold')}>短網址{isEditMode ? '編輯' : '新增'}成功</div>
      <div className={classReader('primary')}>
        <span>您的短網址：</span>
        <a href={url} target="_blank" className={classReader('primary')}>{url}</a>
        <i 
          className={classReader('icon icon-copy icon-sm icon-text-secondary cursor-pointer ml-1')}
          onClick={() => handleCopy(url)}
        />
      </div>

      { url && <QRCode className={classReader('my-4')} data={url} width={300} /> }
      <div className={classReader('mb-4')}>
        <div className={classReader('text-secondary mb-2')}>下載QR Code</div>
        <div>
          <Button label=".png" outline className={classReader('ml-0')} onClick={handleDownloadPNG}/>
          <Button label=".svg" outline className={classReader('ml-0')} onClick={handleDownloadSVG}/>
        </div>
      </div>

      {
        !isEditMode && <Button
          className={classReader('my-4')}
          icon="note-add"
          label="再次建立量產短網址"
          size="md"
          outline
          onClick={() => router.push('/shortener/batch')}
        />
      }

      <Button
        className={classReader('my-4')}
        icon="list"
        label="回到列表頁"
        size="md"
        outline
        onClick={() => router.push(`/shortener/batch/list/${batchId}`)}
      />
    </div>
  )
}

export default FormFinish