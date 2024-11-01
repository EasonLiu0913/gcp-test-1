import React, {
  memo, useEffect, useState, 
} from 'react'
import PropTypes from 'prop-types'
import MUIDataTable from 'mui-datatables'
import { ThemeProvider, createTheme } from '@mui/material/styles'

import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'

import { MUI_DATATABLE_OPTIONS_CONFIG, DEFAULT_THEME } from 'config/muiDataTable'
import classReader from 'utils/classReader'
import { TableRow, TableCell } from '@mui/material'

const muiCache = createCache({
  key: 'mui-datatables',
  prepend: true,
})

const ServerSidePaginationDataTable = (props) => {
  const {
    tableInfo,
    handleTableParams,
    tableButton,
    checkboxInfo,
    childInfo,
    tablePagination,
  } = props

  const {
    title, columns, data, total, theme, options,
  } = tableInfo

  const { checkbox, keyId } = checkboxInfo

  const {
    renderExpandableRow, CHILD_FIELDS_CONFIG, childfieldPreprocessor, childName, childUidNameForMap,
  } = childInfo

  const [rowsSelected, setRowsSelected] = useState([])
  const [rowsSelectedKeys, setRowsSelectedKeys] = useState([])
  const hasBatchData = rowsSelectedKeys.length > 0

  const checkIfRowSelectedArrayDuplicate = (prev, dataIndex) => {
    let filteredArray = prev.filter((index) => index !== dataIndex)
    if (prev.length === filteredArray.length) filteredArray.push(dataIndex)
    return filteredArray
  }

  const updateRowSeleted = () => {
    // 因為 muiTable 顯示 checkbox 需用 Index 顯示, 所以取得目前已選擇行在 table data 的 Index
    const newIndexArray = data.reduce((
      acc, item, index,
    ) => {
      if (rowsSelectedKeys.includes(item[keyId])) return [...acc, index]
      return acc
    }, [])
    setRowsSelected(newIndexArray)
  }

  const updateRowsSelectedKeys = (currentSelectedRow) => {
    const newSelectedKey = data[currentSelectedRow.dataIndex][keyId]
    setRowsSelectedKeys(prev => checkIfRowSelectedArrayDuplicate(prev, newSelectedKey))
  }

  const createChildCell = (
    rowItem, child, rowMeta,
  ) => {
    return (
      <>
        {child.map((el, index) => 
        {
          return (
            <TableRow 
              className={classReader({ 'mui-table__sub-row--checked': rowsSelected.includes(rowMeta.dataIndex) })} 
              key={ el[childUidNameForMap] } 
              // onClick={() => updateRowsSelectedKeys(rowMeta)}
            >
              {
                CHILD_FIELDS_CONFIG.map((childfield, index) => 
                  <TableCell key={el[childUidNameForMap] + index}>
                    {childfieldPreprocessor(el, childfield)}
                  </TableCell>)
              }     
            </TableRow>)
        })}
      </>
    )
  }

  const rowsExpanded = tableInfo.data.reduce((
    acc, row, index,
  ) => {
    if (row[childName]?.length > 0) {
      acc.push(index)
    }
    return acc
  }, [])

  const renderExpandableRowOptions = renderExpandableRow ? {
    // ------- 展開子項目相關屬性 Start --------
    expandableRows: true,
    expandableRowsHeader: false,
    isRowDefaultExpanded: true,
    rowsExpanded,
    renderExpandableRow: (rowData, rowMeta) => {
      const rowItem = tableInfo.data[rowMeta.dataIndex]
      const child = rowItem[childName]
      return (
        <>
          { 
            child?.length > 0 && createChildCell(
              rowItem, child, rowMeta,
            )
          }
        </>
      )
    },
    // ------- 展開子項目相關屬性 End --------
  } : {}

  const checkboxOptions = checkbox ? {
    selectableRows: 'multiple', 
    selectableRowsHeader: true,
    rowsSelected: rowsSelected,
    onRowSelectionChange: (rowsSelected, allRows) => setRowsSelectedKeys(allRows.map(row => data[row.dataIndex][keyId])),
    // onRowClick: (rowData, rowMeta) => updateRowsSelectedKeys(rowMeta),
    selectToolbarPlacement: 'none',
  } : {}

  const switchContent = (button) => {
    switch (button.label) {
    case 'export': 
      return (
        <button 
          className={classReader('btn bg-blue text-white btn-sm')}
          disabled={!hasBatchData}
          onClick={() => button.func(rowsSelectedKeys)}>匯出
        </button>
      )        
    case 'allExport': 
      return (
        <button 
          className={classReader('btn bg-blue text-white btn-sm')}
          onClick={() => button.func()}>匯出全部
        </button>
      )
    case 'transfer':
      return (
        <button 
          className={classReader('btn bg-blue text-white btn-sm')}
          onClick={() => button.func(rowsSelectedKeys)}
          disabled={!hasBatchData}>拋轉     
        </button>
      )
    case 'cancelTransfer':
      return (
        <button 
          className={classReader('btn bg-blue text-white btn-sm')}
          onClick={() => button.func(rowsSelectedKeys)}
          disabled={!hasBatchData}>解除拋轉     
        </button>
      ) 
    case 'uploadExcel': 
      return (
        <button 
          className={classReader('btn bg-blue text-white btn-sm')}
          onClick={() => button.func()}>匯入
        </button>
      )
    default:
      break   
    }
  }
  
  const MUI_DATATABLE_SERVERSIDE_PAGINATION_OPTIONS = {
    ...MUI_DATATABLE_OPTIONS_CONFIG,
    // ------- table pagination 相關屬性 Start --------
    serverSide: true,
    count: total,
    sort: false,
    // sortOrder: sortOrder,
    onTableChange: (action, tableState) => {
      const params = {
        currentPage: tableState.page + 1,
        // sortOrder: tableState.sortOrder,
        pageSize: tableState.rowsPerPage,
        // trigger: 'MuiTable',
      }
      switch (action) {
      case 'changePage':
      case 'changeRowsPerPage':
      case 'sort':
        handleTableParams(params)
        break
      default:
        // console.log('action not handled.')
        break
      }
    },
    // ------- table pagination 相關屬性 End --------
    // ------- checkbox 相關屬性 Start --------
    ...checkboxOptions,
    // ------- checkbox 相關屬性 End --------
    // ------- renderExpandableRow 相關屬性 Start --------
    ...renderExpandableRowOptions,
    // ------- renderExpandableRow 相關屬性 End --------
    // ------- toolbar 相關屬性 Start --------
    customToolbar: () => (
      <ul className={classReader('d-flex list-style-none order-first')}>
        {
          tableButton.map(button => (
            <li key={button.label} className={classReader('mx-2')}>
              { switchContent(button) }
            </li>
          ))
        }
      </ul>
    ),
    // ------- toolbar 相關屬性 End --------
    page: tablePagination.currentPage - 1,
    rowsPerPage: tablePagination.pageSize,
    ...options,
  }
  
  useEffect(() => {
    updateRowSeleted()
  }, [rowsSelectedKeys, data])

  useEffect(() => {
    setRowsSelectedKeys([])
  }, [tablePagination])

  return (
    <section className="mb-3">
      <CacheProvider value={muiCache}>
        <ThemeProvider theme={createTheme(DEFAULT_THEME, theme)}>
          <MUIDataTable
            title={title}
            data={data}
            columns={columns}
            options={MUI_DATATABLE_SERVERSIDE_PAGINATION_OPTIONS}
          />
        </ThemeProvider>
      </CacheProvider>  
    </section>
  )
}

ServerSidePaginationDataTable.propTypes = {
  tableInfo: PropTypes.object,
  handleTableParams: PropTypes.func,
  tableButton: PropTypes.array,
  checkbox: PropTypes.bool,
  childInfo: PropTypes.object,
}

ServerSidePaginationDataTable.defaultProps = {
  tableInfo: {},
  tableButton: [],
  checkboxInfo: {
    checkbox: false,
    key: '',
  },
  // 子項目資訊
  childInfo: {
    renderExpandableRow: false,
    CHILD_FIELDS_CONFIG: [],
    childfieldPreprocessor: () => {},
    childName: '',
    childUidNameForMap: '',
  },
}

export default memo(ServerSidePaginationDataTable)
