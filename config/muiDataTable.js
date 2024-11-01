import Pagination from '@mui/material/Pagination'

export const MUI_DATATABLE_OPTIONS_CONFIG = {
  search: false,
  download: false,
  print: false,
  viewColumns: true,
  filter: false,
  sort: false,
  filterType: 'dropdown',
  responsive: 'standard', // expected one of ['standard','vertical','verticalAlways','simple'].
  selectableRows: 'none', // Please use string option: 'multiple' | 'single' | 'none'
  pagination: true,
  textLabels: {
    body: {
      noMatch: '找不到相關的搜尋結果',
      toolTip: '排序',
    },
    viewColumns: {
      title: '顯示欄位',
      titleAria: '顯示欄位',
    },
  },
}

// 子訂單高度與主訂單高度不同，產生偏移導致部分 Checkbox 底線消失，因此統一預設高度
const DEFAULT_TABLE_ROW_HEIGHT = '74px' 


// 不想用這個theme 是因為
// 1. css priority 很低，很常要寫important
// 2. 寫法不易閱讀，還是希望回歸傳統CSS　寫法
// 3. 沒辦法拿已經定義好的color，還是得在這裡額外死

export const DEFAULT_THEME = {
  components: {
    // MuiPaper: { styleOverrides: { root: { padding: 30 } } },
    MuiTableRow: {
      styleOverrides: {
        root: { 
          '&': {
            height: DEFAULT_TABLE_ROW_HEIGHT,
            boxSizing: 'border-box', 
          },
          '& th': { whiteSpace: 'nowrap' },
          '& th span': { justifyContent: 'center' },
          '& th span button': {
            marginRight: 0,
            marginLeft: 0,
          },
          '& td': { borderBottom: 'none' }, 
          ':has(.PrivateSwitchBase-input):not(:first-of-type) td': { borderTop: '1px solid rgba(224, 224, 224, 1)' },
          ':has(.PrivateSwitchBase-input):last-of-type td': { borderBottom: '1px solid rgba(224, 224, 224, 1)' },
          '&:hover ': { backgroundColor: '#F5F5F5 !important' }, 
          '&:hover > td:first-of-type ': { backgroundColor: '#F5F5F5 !important' }, 
          '&.mui-row-selected >:first-of-type': { backgroundColor: '#eee' },
        }, 
      }, 
    },
    // MuiToolbar: {
    //   styleOverrides: {
    //     root: {
    //       minHeight: 'unset !important',
    //       padding: '0 !important',
    //       '& .tss-qbo1l6-MUIDataTableToolbar-actions': {
    //         display: 'flex',
    //         justifyContent: 'flex-end',
    //         alignItems: 'center',
    //         columnGap: '10px',
    //       },
    //     },
    //   },
    // },
    MuiTableCell: {
      styleOverrides: {
        root: { 
          '&': { textAlign: 'center' },
          ':has(.PrivateSwitchBase-input)': { backgroundColor: '#fff' },
          '.MuiButtonBase-root #expandable-button': { display: 'none' },
          '&:first-of-type': {
            backgroundColor: '#fff',
            position: 'sticky',
            left: 0, 
          }, 
        }, 
      }, 
    },
    MuiTable: {
      styleOverrides: {
        root: {
          '& nav': {
            width: 'fit-content',
            margin: 'auto', 
          },
          '& .Mui-selected': { backgroundColor: '#539BFF !important' },
          '& thead th': { padding: '30px 0 20px' },
        }, 
      }, 
    },
  },
}