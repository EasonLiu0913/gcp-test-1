import React, { memo, useEffect } from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'
import Button from 'common/Button'
import CardSection from 'src/common/card/CardSection'
import { useRouter } from 'next/router'
import { DEFAULT_FILTER_VALUE } from 'config/shortener'

const SearchBox = ({
  children,
  submitBtnLabel,
  cancelBtnLabel,
  handleSubmit,
  reset,
  setValue,
  getValues,
  setFilter,
  isSearching,
}) => {
  const router = useRouter()

  const onSubmit = (data) => {
    setFilter(data)
  }
  
  useEffect(() => {
    if (router.isReady) {
      const parseQuery = async () => {
        for (let key in router.query) {
          if (getValues(key) !== undefined) {
            if (Array.isArray(getValues(key))) {
              await setValue(key, router.query[key].split(','))
            } else {
              await setValue(key, router.query[key])
            }
          }
        }
        setFilter(getValues())
      }
      parseQuery()
    }
  }, [router.isReady])

  return <>
    <CardSection
    // header
    >
      <div className={classReader('row')}>

        {children}

        <div className={classReader('col-12')}>
          <div className={classReader('px-2')}>
            <Button
              className={classReader('ml-0')}
              label={submitBtnLabel ?? '搜尋'}
              onClick={() => handleSubmit(onSubmit)()}
              isLoading={isSearching}
              disabled={isSearching}
            />
            <Button
              textColor="text-secondary"
              label={cancelBtnLabel ?? '重置'}
              color="gray-5"
              onClick={() => {
                reset()
                setFilter(DEFAULT_FILTER_VALUE)
              }}
            />
          </div>
        </div>
      </div>
    </CardSection>
  </>
}

SearchBox.propTypes = {
  children: PropTypes.node,
  submitBtnLabel: PropTypes.string,
  cancelBtnLabel: PropTypes.string,
  handleSubmit: PropTypes.func,
  reset: PropTypes.func,
  setValue: PropTypes.func,
  getValues: PropTypes.func,
  setFilter: PropTypes.func,
  isSearching: PropTypes.bool,
}

export default memo(SearchBox)