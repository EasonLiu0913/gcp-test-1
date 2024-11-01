import React from 'react'
import classReader from 'utils/classReader'
import Button from 'common/Button'
import { useRouter } from 'next/router'

const FormFinish = () => {
  const router = useRouter()

  return (
    <div className={classReader('text-center', { ShortenerStyle: 'create-form' })}>
      <div className={classReader('pb-3 h5 bold')}>量產短網址成功</div>
      <Button
        className={classReader('my-4')}
        icon="note-add"
        label="再次建立短網址"
        size="lg"
        outline
        onClick={() => router.push('/shortener/batch/create')}
      />
      <Button
        className={classReader('my-4')}
        icon="list"
        label="回到列表頁"
        size="lg"
        outline
        onClick={() => router.push('/shortener/batch')}
      />
    </div>
  )
}

export default FormFinish