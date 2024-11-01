import React from 'react'
import classReader from 'utils/classReader'
import { handleHeadParams } from 'utils/util'
import SearchBar from 'src/common/SearchBar'
import DatePicker from 'common/form/DatePicker'
import Select from 'common/form/Select'

export async function getServerSideProps(context) {
  const headParams = handleHeadParams(context)
  return { props: { ...headParams } }
}

const Manage = ({
  control,
  handleSubmit,
  register,
  reset,
  setValue,  
}) => {
  
  const onSubmit = (data) => {
    // console.log(data)
  }

  return <SearchBar
    handleSearch={handleSubmit(onSubmit)}
    handleReset={reset}
  >
    <div className={classReader('col-12 col-sm-6 col-md-4')}>
      <div className={classReader('px-2')}>
        <div className={classReader('text-title')}>日期區間（起）</div>
        <DatePicker
          className={classReader('mb-4')}
          name="expiryDateStart"
          control={control}
        />
      </div>
    </div>

    <div className={classReader('col-12 col-sm-6 col-md-4')}>
      <div className={classReader('px-2')}>
        <div className={classReader('text-title')}>日期區間（訖）</div>
        <DatePicker
          className={classReader('mb-4')}
          name="expiryDateEnd"
          control={control}
        />
      </div>
    </div>

    <div className={classReader('col-12 col-sm-6 col-md-4')}>
      <div className={classReader('px-2')}>
        <div className={classReader('text-title')}>時間刻度</div>
        <Select
          name=" "
          options={[
            {
              label: '天',
              value: 'day',
            },
            {
              label: '小時',
              value: 'hour',
            },
          ]}
          register={register}
          placeholder="天 / 小時"
          onChange={(name, val) => setValue(name, val)}
        />
      </div>
    </div>
  </SearchBar>
}
export default Manage