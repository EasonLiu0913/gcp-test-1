import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react'
import classReader from 'utils/classReader'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { useError } from 'context/ErrorContext'
import SearchBar from 'common/SearchBar'
import MUIDataTable from 'common/MUIDataTable'

const TableWithSearch = forwardRef(function TableWithSearch({
  createType = 'Auto',
  APIResultFormatter,
  customToolbar,
  fetchAPI,
  getValues,
  handleSubmit,
  reset,
  tableColumns,
  searchBarChildren,
  searchBarClassName = '',
  searchBarStatus = true,
  setValue,
  tagsFromUserClick = [],
}, ref) {
  
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState({})
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const { reportError } = useError()
  const router = useRouter()
  const isFirstRender = useRef(true)

  const fetchData = async (params) => {
    try {
      setIsLoading(true)
      setData([])
      if (typeof fetchAPI !== 'function') reportError({ errorNo: 9999 })
        
      const apiParams = {
        ...getValues(),
        page, 
      }
      
      const result = await fetchAPI(apiParams)
      console.log('fetchData ~ result:', result)
      const { data, success } = result
      if (!success) {
        setPage(1)
        setTotalCount(0)
        reportError({ errorNo: result.errorNo || 9999 })
        return
      }

      setTotalCount(data?.totalCount ?? 0)
      const resultData = APIResultFormatter ? APIResultFormatter(data?.pagedList || [], data?.pageNumber ?? 1) : data?.pagedList || []
      if (resultData.length > 0) setData(resultData)
   
    } catch (err) {
      setPage(1)
      setTotalCount(0)
      reportError(err)
    } finally {
      setIsLoading(false)
    }
  }

  useImperativeHandle(ref, () => ({
    fetchData,
    data,
    setData,
  }))

  const resetPageAndTotalCount = () => {
    setPage(1)
    setTotalCount(0)
  }

  const handleFilter = (newFilter) => {
    setFilter(newFilter)
    resetPageAndTotalCount()
  }

  useEffect(() => {
    resetPageAndTotalCount()
  }, [tagsFromUserClick])

  useEffect(() => {
    if (router.isReady) {
      //統一跳掉預設初次的useEffect
      if ( isFirstRender.current && searchBarStatus) isFirstRender.current = false
      //SearchBox 整理完router.query後，打handleFilter 會setFilter，然後回到這邊
      else fetchData()
    }
  }, [
    router.isReady,
    filter,
    tagsFromUserClick,
    page,
    createType,
  ])

  return <>
    {searchBarStatus && <div className={classReader('mb-4', searchBarClassName)}>
      <SearchBar
        setFilter={handleFilter}
        tagsFromUserClick={tagsFromUserClick}
        handleSubmit={handleSubmit}
        reset={reset}
        setValue={setValue}
        getValues={getValues}
      >
        {searchBarChildren()}
      </SearchBar>
    </div>}
   
    <MUIDataTable
      data={data}
      columns={tableColumns}
      options={{ customToolbar }}
      isLoading={isLoading}
      totalCount={totalCount}
      page={page}
      onPageChange={(page) => setPage(page)}
    />
  </>
})

TableWithSearch.propTypes = {
  APIResultFormatter: PropTypes.func, // APIResultFormatter 會在fetchAPI 拿到資料後執行（如果有提供的話），可以把api 的資料轉換成table 要的格式, (object[]): object[]
  customToolbar: PropTypes.func,
  fetchAPI: PropTypes.func, // fetch API function, (filter: {}, page: number): fetchApiResponse
  getValues: PropTypes.func, //from react-hook-form
  handleSubmit: PropTypes.func, //from react-hook-form
  reset: PropTypes.func, //from react-hook-form
  tableColumns: PropTypes.array, //欄位設定，用的是mui-datatables，可以參考 https://www.npmjs.com/package/mui-datatables 的 Customize Columns欄目
  searchBarChildren: PropTypes.func,
  searchBarClassName: PropTypes.string,
  searchBarStatus: PropTypes.bool,
  setValue: PropTypes.func, //from react-hook-form
  tagsFromUserClick: PropTypes.array, // add tag from user click
  createType: PropTypes.string,
}

export default TableWithSearch