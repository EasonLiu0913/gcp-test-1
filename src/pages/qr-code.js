import React, { useState, useEffect } from 'react'
import QRCode from 'common/QRCode'
import { useRouter } from 'next/router'

import qrcode from 'qrcode'

const QrCode = (props) => {
  const router = useRouter()
  const { url, type } = router.query //type = 'png' | 'svg'
  const [svgString, setSvgString] = useState('')

  useEffect(() => {
    if (type === 'svg' && url) {
      qrcode.toString(
        url, { width: 300 }, (err, string) => {
          setSvgString(string)
        },
      )
    }
  }, [type, url])

  if (type === 'svg') {
    return <div
      dangerouslySetInnerHTML={{ __html: svgString }}
    />
  } else if (type === 'png') {
    return <QRCode data={url} width={300}/>
  } else {
    return <div />
  }
}

export default QrCode
