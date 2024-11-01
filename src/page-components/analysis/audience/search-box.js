import React from 'react'
import classReader from 'utils/classReader'
import { handleHeadParams } from 'utils/util'
import Input from 'common/form/Input'
import Select from 'common/form/Select'
import SearchBar from 'src/common/SearchBar'
import DatePicker from 'common/form/DatePicker'

export async function getServerSideProps(context) {
  const headParams = handleHeadParams(context)
  return { props: { ...headParams } }
}

const SearchBox = ({
  control,
  handleSubmit,
  register,
  reset,
  setValue,
}) => {
  return <SearchBar
    handleSearch={handleSubmit}
    handleReset={() => { reset() }}
  >
    <div className={classReader('col-12 col-sm-6 col-md-4')}>
      <div className={classReader('px-2')}>
        <div className={classReader('text-title')}>短網址</div>
        <Input
          className={classReader('w-100')}
          name="code"
          register={register}
        />
      </div>
    </div>

    <div className={classReader('col-12 col-sm-6 col-md-8')}>
      <div className={classReader('px-2')}>
        <div className={classReader('text-title')}>目標網址</div>
        <Input
          name="destUrl"
          register={register}
        />
      </div>
    </div>

    <div className={classReader('col-12 col-sm-6 col-md-4')}>
      <div className={classReader('px-2')}>
        <div className={classReader('text-title')}>utm_source</div>
        <Input
          name="source"
          register={register}
        />
      </div>
    </div>

    <div className={classReader('col-12 col-sm-6 col-md-4')}>
      <div className={classReader('px-2')}>
        <div className={classReader('text-title')}>utm_medium</div>
        <Input
          name="medium"
          register={register}
        />
      </div>
    </div>

    <div className={classReader('col-12 col-sm-6 col-md-4')}>
      <div className={classReader('px-2')}>
        <div className={classReader('text-title')}>utm_campaign</div>
        <Input
          name="campaign"
          register={register}
        />
      </div>
    </div>

    <div className={classReader('col-12 col-sm-6 col-md-4')}>
      <div className={classReader('px-2')}>
        <div className={classReader('text-title')}>到期區間（起）</div>
        <DatePicker
          className={classReader('mb-4')}
          name="expiryDateStart"
          control={control}
        />
      </div>
    </div>

    <div className={classReader('col-12 col-sm-6 col-md-4')}>
      <div className={classReader('px-2')}>
        <div className={classReader('text-title')}>到期區間（訖）</div>
        <DatePicker
          className={classReader('mb-4')}
          name="expiryDateEnd"
          control={control}
        />
      </div>
    </div>

    <div className={classReader('col-12 col-sm-6 col-md-4')}>
      <div className={classReader('px-2')}>
        <div className={classReader('text-title')}>短網址類別</div>
        <Select
          name="type"
          options={[
            {
              label: '單一',
              value: 'single',
            },
            {
              label: '量產',
              value: 'batch',
            },
            {
              label: '個人化',
              value: 'oneOnOne',
            },
          ]}
          register={register}
          onChange={(name, val) => setValue(name, val)}
        />
      </div>
    </div>
  </SearchBar>
}
export default SearchBox