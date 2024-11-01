import React, { memo } from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'
import { SORTED_CONFIG } from 'config/dashboard'

const SortedBtn = ({
  className = '',
  id = '',
  setSortedIndex = () => {}, 
  sortedIndex = '',
}) => {

  return <div className={classReader('scrollbar-x')}>
    <div 
      id={id} 
      className={classReader(
        'd-flex pb-2 w-fit',
        { DashboardStyle: 'sorted' },
        className,
      )}>
      {SORTED_CONFIG.map((item, key) => <div
        key={key}
        className={classReader('border rounded d-flex flex-center flex-column text-sm text-sm-md', { DashboardStyle: 'sorted-btn' })}
        onClick={() => setSortedIndex(item.index)}
      >
        <i className={classReader(`icon icon-apps ${sortedIndex === item.index ? 'icon-primary' : 'icon-text-secondary'}`)}/>
        <div className={classReader(`${sortedIndex === item.index ? 'primary' : 'text-secondary'}`)}>{item.label}</div>
      </div>)}
    </div>
  </div>
}

SortedBtn.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  setSortedIndex: PropTypes.func,
  sortedIndex: PropTypes.string,
}

export default memo(SortedBtn)