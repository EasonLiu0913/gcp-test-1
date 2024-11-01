import React, {
  useState,
  useEffect,
  useCallback,
  memo,
} from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'
import Checkbox from 'common/form/Checkbox'

const CheckboxGroup = ({
  className,
  disabled = false,
  id,
  keepColor = false,
  name,
  onChange = () => {},
  options,
  readonly = false,
  register,
  row = false,
  selection,
}) => {

  // handle if used with react hook form
  const [selectionList, setSelectionList] = useState([])

  // with react hook form
  const atSetSelectionList = useCallback((val, checked) => {
    setSelectionList(prev => {
      if (checked) {
        return [...prev, val]
      } else {
        return prev.filter(item => item !== val)
      }
    })
  }, [])

  const handleValid = useCallback((
    value, checked, name,
  ) => {
    onChange(
      value, checked, name,
    )
  }, [options])

  useEffect(() => {
    if (selection === void 0) return
    setSelectionList(selection)
  }, [selection])

  return (
    <section className={classReader('checkbox--with-bottom', className)} id={id}>
      {options?.map((option, index) => {
        const isActive = selectionList.find(item => item === option.value) !== void 0
        return (
          <Checkbox
            key={index}
            label={option.label}
            name={name}
            value={option.value}
            checked={isActive}
            color={option?.color || ''}
            row={row}
            keepColor={keepColor}
            readonly={readonly}
            disabled={disabled}
            register={register}
            onSetSelectionList={atSetSelectionList}
            onChange={handleValid}
          />
        )
      })}

    </section>
  )
}

CheckboxGroup.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  keepColor: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.array,
  readonly: PropTypes.bool,
  register: PropTypes.func, // with react-hook form
  row: PropTypes.bool,
  selection: PropTypes.array,
}

export default memo(CheckboxGroup)