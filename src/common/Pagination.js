import React, {
  useState,
  useEffect,
  memo,
} from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'
import ReactPaginate from 'react-paginate'

const Pagination = ({
  activeClassName,
  breakClassName,
  breakLabel = '...',
  className,
  currentPage = 1,
  disabled = false,
  id,
  input = false,
  itemsCount = 0,
  itemsPerPage = 0,
  marginPagesDisplayed = 2,
  nextClassName,
  nextLabel = (<i className={classReader('icon icon-arrow-right icon-gray-4 icon-md')} />),
  onPageChange = () => {},
  pageClassName,
  pageLinkClassName,
  pageRangeDisplayed = 2,
  paginateClassName,
  previousClassName,
  previousLabel = (<i className={classReader('icon icon-arrow-left icon-gray-4 icon-md')} />),
  renderOnZeroPageCount = () => {},
}) => {

  const [inputPage, setInputPage] = useState(1)

  const pageCount = Math.ceil(itemsCount / itemsPerPage)

  const handlePageChange = (e) => {
    const newOffset = (e.selected * itemsPerPage) % itemsCount
    const endOffset = newOffset + itemsPerPage

    onPageChange(
      newOffset, endOffset, e.selected + 1,
    )
  }

  const handleInputPageChange = () => {
    let value = Number(inputPage)
    if (isNaN(value) || currentPage === value) {
      // reset input value
      setInputPage(currentPage)
    } else {
      if (value < 1) {
        value = 1
      } else if (value > pageCount) {
        value = pageCount
      }

      // touch off api search
      handlePageChange({ selected: value - 1 })
    }
  }

  useEffect(() => {
    setInputPage(currentPage)
  }, [currentPage])

  return (
    <section
      className={classReader(
        'pagination',
        { 'pagination--mobile': input },
        className,
      )}
      id={id}
    >
      <ReactPaginate
        className={classReader('react-paginate pagination--style-reset', paginateClassName)}
        pageClassName={classReader('pagination__page', pageClassName)}
        pageLinkClassName={classReader('pagination__page--number', pageLinkClassName)}
        activeClassName={classReader('pagination__page--selected', activeClassName)}
        previousClassName={classReader('pagination--prev', previousClassName)}
        nextClassName={classReader('pagination--next', nextClassName)}
        breakClassName={classReader('pagination__page--break', breakClassName)}
        breakLabel={breakLabel}
        nextLabel={nextLabel}
        previousLabel={previousLabel}
        onPageChange={handlePageChange}
        pageRangeDisplayed={pageRangeDisplayed}
        marginPagesDisplayed={marginPagesDisplayed}
        forcePage={currentPage - 1}
        pageCount={pageCount}
        renderOnZeroPageCount={renderOnZeroPageCount}
        disabled={disabled}
      />

      {input && (
        <div className={classReader('pagination__page--input')}>
          到第
          <input
            className={classReader('pagination__page--input-native')}
            type="tel"
            value={inputPage}
            min={1}
            onChange={(e) => setInputPage(e.target.value)}
            disabled={disabled}
            onBlur={handleInputPageChange}
          />
          頁
        </div>
      )}
    </section>
  )
}

Pagination.propTypes = {
  activeClassName: PropTypes.string,
  breakClassName: PropTypes.string, // 隱藏區間塊 className
  breakLabel: PropTypes.node, // 隱藏區間塊 顯示文字
  className: PropTypes.string,
  currentPage: PropTypes.number,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  input: PropTypes.bool,
  itemsCount: PropTypes.number, // 總筆數
  itemsPerPage: PropTypes.number, // 一頁顯示多少筆
  marginPagesDisplayed: PropTypes.number, // 邊距顯示的頁數
  nextClassName: PropTypes.string,
  nextLabel: PropTypes.node,
  onPageChange: PropTypes.func,
  pageClassName: PropTypes.string,
  pageLinkClassName: PropTypes.string,
  pageRangeDisplayed: PropTypes.number, // 顯示的頁面範圍
  paginateClassName: PropTypes.string,
  previousClassName: PropTypes.string,
  previousLabel: PropTypes.node,
  renderOnZeroPageCount: PropTypes.func,
}

export default memo(Pagination)
