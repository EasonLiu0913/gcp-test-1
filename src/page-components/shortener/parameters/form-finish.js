import React from 'react'
import classReader from 'utils/classReader'
import Button from 'common/Button'
import { useRouter } from 'next/router'

const FormFinish = () => {
  const router = useRouter()

  return (
    <div className={classReader('text-center', { ShortenerStyle: 'create-form' })}>
      <div className={classReader('pb-3 h5 bold')}>系統正在批量生產中，建立完成將發送信件通知，感謝使用</div>
      <Button
        className={classReader('my-4')}
        icon="note-add"
        label="再次建立1:1自定義參數短網址"
        size="lg"
        outline
        onClick={() => router.push('/shortener/parameters/create')}
      />
      <Button
        className={classReader('my-4')}
        icon="list"
        label="回到列表"
        size="lg"
        outline
        onClick={() => router.push('/shortener/parameters')}
      />
    </div>
  )
}

export default FormFinish