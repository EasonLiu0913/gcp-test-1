import React, { memo } from 'react'
import MUIDataTable from 'mui-datatables'
import classReader from 'utils/classReader'
import { MUI_DATATABLE_OPTIONS_CONFIG } from 'config/muiDataTable'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import Pagination from '@mui/material/Pagination'
import useMediaQuery from '@mui/material/useMediaQuery'

const muiCache = createCache({
  key: 'mui-datatables',
  prepend: true,
})

export const ROWS_PER_PAGE = 10

const DataTable = ( {
  columns,
  data,
  isLoading,
  options,
  onPageChange,
  page,
  totalCount,
}) => {

  const isSmAndUp = useMediaQuery('(min-width: 600px)')

  return <>
    <section className={classReader('mb-3 data-table scrollbar-x')}>
      <CacheProvider value={muiCache}>
        <MUIDataTable
          data={data}
          columns={columns}
          options={{
            ...MUI_DATATABLE_OPTIONS_CONFIG,
            textLabels: { body: { noMatch: isLoading ? '搜尋中...' : '查無資料' } },
            customFooter: () => <tbody>
              <tr>
                <td>
                  <Pagination
                    count={Math.ceil(totalCount / ROWS_PER_PAGE)}
                    page={page}
                    onChange={(event, page) => onPageChange(page)}
                    size={isSmAndUp ? 'medium' : 'small'}
                  />
                </td>
              </tr>
            </tbody>,
            ...options,
          }}
        />
      </CacheProvider>
    </section>
  </>
}

export default memo(DataTable)