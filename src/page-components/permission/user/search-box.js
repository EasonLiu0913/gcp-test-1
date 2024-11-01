import React from 'react'
import classReader from 'utils/classReader'
import Input from 'common/form/Input'
import Select from 'common/form/Select'
import SearchBar from 'src/common/SearchBar'

const AllUserSearchBar = ( {
  handleSubmit,
  register,
  reset,
  setValue,  
}) => {

  return <SearchBar
    handleSearch={handleSubmit}
    handleReset={() => reset()}
  >

    <div className={classReader('col-12 col-sm-6 col-md-3')}>
      <div className={classReader('px-2')}>
        <div className={classReader('text-title')}>姓名</div>
        <Input
          className={classReader('w-100')}
          name="name"
          register={register}
        />
      </div>
    </div>

    <div className={classReader('col-12 col-sm-6 col-md-3')}>
      <div className={classReader('px-2')}>
        <div className={classReader('text-title')}>Email</div>
        <Input
          name="email"
          register={register}
        />
      </div>
    </div>

    <div className={classReader('col-12 col-sm-6 col-md-3')}>
      <div className={classReader('px-2')}>
        <div className={classReader('text-title')}>啟用狀態</div>
        <Select
          name="status"
          options={[
            {
              label: '全部',
              value: 'all',
            },
            {
              label: '啟用',
              value: 'enabled',
            },
            {
              label: '停用',
              value: 'disabled',
            },
          ]}
          register={register}
          onChange={(name, val) => setValue(name, val)}
        />
      </div>
    </div>

    <div className={classReader('col-12 col-sm-6 col-md-3')}>
      <div className={classReader('px-2')}>
        <div className={classReader('text-title')}>品牌</div>
        <Select
          name="brandName"
          options={[
            {
              label: '品牌1',
              value: 'brand1',
            },
            {
              label: '品牌2',
              value: 'brand2',
            },
            {
              label: '品牌3',
              value: 'brand3',
            },
          ]}
          register={register}
          onChange={(name, val) => setValue(name, val)}
        />
      </div>
    </div>
  </SearchBar>
}

export default AllUserSearchBar