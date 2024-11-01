import React, { useState, useEffect } from 'react'
import classReader from 'utils/classReader'
import Input from 'common/form/Input'
import Button from 'common/Button'
import Modal from 'common/Modal'
import { useRouter } from 'next/router'
import { nextStep } from 'slices/stepperSlice'
import { useDispatch } from 'react-redux'
import UploadButton from 'common/UploadButton'
import shortenerBatchAPI from 'apis/shortenerBatch'
import { hookFormValidates } from 'utils/hookFormValidates'

const FormOne = ({
  formState: { errors },
  getValues,
  register,
  trigger,  
}) => {
  const [isOpenExitDlg, setIsOpenExitDlg] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()
  const [filePath, setFilePath] = useState('')

  const handleNext = async () => {

    const validationResult = await trigger(['batchName', 'filePath'])
    if (!validationResult) return
    dispatch(nextStep())
  }

  const downloadTemplate = async () => {
    let result = await shortenerBatchAPI.downloadSampleFile()
    const href = URL.createObjectURL(result)
    const link = document.createElement('a')
    link.href = href
    link.setAttribute('download', 'batchTemplate.csv')
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    URL.revokeObjectURL(href)
  }

  useEffect(() => {
    setFilePath(getValues().filePath?.[0]?.name)
  }, [])

  return (
    <div className={classReader({ ShortenerStyle: 'create-form' })}>
      <div className={classReader('px-2')}>
        <div className={classReader('text-title text-required')}>檔案名稱</div>
        <Input
          name="batchName"
          register={register}
          validate={hookFormValidates().batchName}
          controllerError={errors?.batchName?.message}
        />
      </div>

      <div className={classReader('px-2 pb-3')}>
        <div className={classReader('text-title text-required')}>選擇要匯入的CSV檔案</div>
        <div className={classReader('mb-2')}>{filePath}</div>
        <UploadButton
          className={classReader('ml-0')}
          label="匯入檔案"
          register={register}
          name="filePath"
          onChange={() => setFilePath(getValues().filePath[0].name)}
          validate={hookFormValidates().filePath}
          controllerError={errors?.filePath?.message}
          acceptType=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />
        <Button color="secondary" icon="download" label="下載範本" onClick={downloadTemplate} />
      </div>

      <div className={classReader('py-3', { ShortenerStyle: 'btn-row' })}>
        <Button color="red" onClick={() => setIsOpenExitDlg(true)} label="取消" />
        <Button onClick={handleNext} label="下一步" />
      </div>

      <Modal
        prompt={isOpenExitDlg}
        okBtn="繼續新增"
        onOk={() => setIsOpenExitDlg(false)}
        cancelBtn="離開"
        onCancel={() => router.push('/shortener/batch')}
      >
        <p className={classReader('text-center')}>您確定要停止量產短網址嗎？</p>
      </Modal>
    </div>
  )
}

export default FormOne