import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'
import qrcode from 'qrcode'
import { lastSegmentOfURL } from 'utils/util'
const QRCode = ({
  className,
  data = '',
  type = 'png',
  width = 300,
}) => {

  const qrCodeRef = useRef(null)

  useEffect(() => {
    qrcode.toCanvas(
      qrCodeRef.current, data, {
        width,
        type: `image/${type}`,
      },
    )
  }, [])

  return (
    <canvas ref={qrCodeRef} className={classReader('qr-code', className)}/>
  )
}

QRCode.propTypes = {
  className: PropTypes.string,
  data: PropTypes.string,
  type: PropTypes.string,
  width: PropTypes.number,
}

export default QRCode

export const downloadSVG = (url) => {
  const fileName = lastSegmentOfURL(url)
  qrcode.toString(
    url, {
      type: 'svg',
      width: 300,
    }, function (err, url) {
      if (err) throw (err)
      const blob = new Blob([url], { type: 'image/svg+xml' })
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = fileName ?? 'qrcode_svg'
      a.click()
      URL.revokeObjectURL(blobUrl)
    },
  )
}

export const downloadPNG = (url) => {
  const fileName = lastSegmentOfURL(url)
  qrcode.toDataURL(
    url, { width: 300 }, function (err, url) {
      if (err) throw (err)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName ?? 'qrcode_png'
      a.click()
    },
  )
}