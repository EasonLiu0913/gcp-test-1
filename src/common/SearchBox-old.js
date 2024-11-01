import React, { useState, memo } from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'

import Input from 'common/form/Input'
import Button from 'common/Button'
import {
  DatePicker, TimePicker, DateTimePicker, 
} from '@mui/x-date-pickers'
// import Switch from 'common/form/Switch'

import { Select, MenuItem } from '@mui/material'

const SearchBox = (props) => {
  const {
    fieldData, handleSearch, handleReset, handleChange, submitBtnLabel, cancelBtnLabel,
  } = props
  const [enableSubmit, setEnableSubmit] = useState(true)
  const fieldValidateMap = new Map()
  const handleValidate = (isVaild, name) => {
    fieldValidateMap.set(name, isVaild)
    for (let value of fieldValidateMap.values()) {
      if (!value) {
        setEnableSubmit(false) 
        break
      }
      setEnableSubmit(true)
    }
  }

  function switchContent(field){
    switch (field.type) {
    case 'select':
      return (
        <Select
          className={classReader('search-box__select field--with-bottom')}
          value={field.options?.length > 0 ? field.value : ''}
          defaultValue={field.options?.length > 0 ? field.value : ''}
          name={field.name}
          onChange={({ target: { value, name } }) => {handleChange((name, value))}}
          displayEmpty
          size="small"
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value="" className={classReader('hidden')}>
            <span className={classReader('text-md text-gray-4 text-weight-bold')}>{field.customPlaceholder ?? `請選擇${field.placeholder || '' }`}</span>
          </MenuItem>
          {
            Array.isArray(field.options) && field.options.length > 0 && field.options.map((option, index) => {
              const [name = 'name', label = 'label'] = field.optionKeysFromAPI || []
              return <MenuItem key={index} value={option[name]}>{option[label]}</MenuItem>
            })
          }
        </Select>
      )
    case 'multipleSelect':
      return (
        <Select
          className={classReader('search-box__select field--with-bottom')}
          value={field.options?.length > 0 ? field.value : ''}
          defaultValue={field.options?.length > 0 ? field.value : ''}
          name={field.name}
          onChange={({ target: { value, name } }) => handleChange((name, value))}
          displayEmpty
          size="small"
          inputProps={{ 'aria-label': 'Without label' }}
          multiple
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <span className={classReader('text-md text-gray-4 text-weight-bold')}>{`請選擇${field.placeholder}`}</span>
            }
            const [name = 'name', label = 'label'] = field.optionKeysFromAPI || []
            const selectedLabel = field.options.filter(el => selected.includes(el[name])).map(el => el[label])
            return selectedLabel.join(',')
          }}
        >
          {
            Array.isArray(field.options) && field.options.length > 0 && field.options.map((option, index) => {
              const [name = 'name', label = 'label'] = field.optionKeysFromAPI || []
              return <MenuItem key={index} value={option[name]}>{option[label]}</MenuItem>
            })
          }
        </Select>
      )   
    case 'text':
      return (<Input
        type="text"
        className={classReader('search-box__input')}
        placeholder={field.customPlaceholder ?? `請選擇${field.placeholder || '' }`}
        name={field.name}
        value={field.value || ''}
        size="sm"
        dense
        validate={field.validate}
        onValidate={(isVaild) => handleValidate(isVaild, field.name)}
        onChange={handleChange}
      />)
    case 'datepicker':
      return (
        <DatePicker
          name={field.name}
          onChange={handleChange}
        />
      )
    // case 'dateRangePicker':
    //   return (
    //     <DatePicker
    //       mode="range"
    //       field={{
    //         ...field,
    //         ...field.props,
    //       }}
    //       handleChange={handleChange}
    //     />
    //   )
    //   break
      // case 'switch':
      //   return <Switch
      //       name={field.name}
      //       value={field.value}
      //       onLabel={field.onLabel}
      //       offLabel={field.offLabel}
      //       onLabelColor={field.onLabelColor}
      //       offLabelColor={field.offLabelColor}
      //       inactiveLabelColor={field.inactiveLabelColor}
      //       onChange={handleChange}
      //   />
      //   break
    case 'plainText':
      return <div className={classReader('search-box__plainText')}>{field.value}</div>
    case 'filterTag':
      const handleChangeTag = (tag, name) => {
        const isAllSelected = field.value.length === field.options.length
        const updateFilterTag = field.options.filter((
          option, index, array,
        ) => {
          // 全部
          if (tag === 'all') {
            if (isAllSelected) return false
            return array
          }

          // 處理如果目前是全選，點擊除了全部的其他標籤
          if (isAllSelected) {
            return option.name === tag
          }
          
          // 處理點選的標籤數量等於全部標籤時,自動觸發點選全部按鈕
          if (!field.value.includes(tag) && field.value.length === field.options.length - 2) {
            return array
          }
          
          // 已選擇標籤，再次點擊取消選擇
          if (option.name === tag && field.value.includes(tag)) {
            return false
          }

          return field.value.includes(option.name) || option.name === tag
        }).map(el => el.name)

        handleChange(updateFilterTag, name)
      }
      return (
        <div className={classReader('d-flex align-items-center search-box__tag')}>
          {
            field.options.map(el => (
              <Button
                key={el.name}
                className={classReader('px-3')}
                label={el.label}
                color={field.value.includes(el.name) ? 'blue' : 'gray-1'}
                textColor={field.value.includes(el.name) ? 'white' : 'gray-7'}
                size="sm"
                onClick={() => handleChangeTag(el.name, field.name)}
                rounded
                unelevated
              />
            ))
          }
        </div>
      )

    }
    
  }

  return (
    <section
      className={
        classReader('bg-white mb-4 shadow-2', 'search-box')
      }
    >

      <Button
        className={classReader('btn btn--outline px-4 mr-2 text-sm')}
        type="submit"
        label={submitBtnLabel ?? '搜尋'}
        color="primary"
        textColor="white"
        disabled={!enableSubmit}
        onClick={() => enableSubmit && handleSearch()}
      />

      <Button
        className={classReader('btn btn--flat px-4 text-sm')}
        type="submit"
        label={cancelBtnLabel ?? '重置'}
        color="gray-5"
        textColor="text-secondary"
        onClick={() => handleReset()}
      />
    </section>
  )
}

SearchBox.propTypes = {
  fieldData: PropTypes.array.isRequired,
  handleSearch: PropTypes.func,
  handleChange: PropTypes.func,
  handleReset: PropTypes.func,
  submitBtnLabel: PropTypes.string,
  cancelBtnLabel: PropTypes.string,
}

SearchBox.defaultProps = { handleReset: () => {} }

export default memo(SearchBox)