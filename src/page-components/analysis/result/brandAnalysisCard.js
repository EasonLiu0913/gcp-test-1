import React from 'react'
import PropTypes from 'prop-types'
import { handleHeadParams } from 'utils/util'
import AnalysisCard from 'common/card/AnalysisCard'
import classReader from 'utils/classReader'
import ReactLoading from 'react-loading'
import { DEFAULT_SIZES } from 'config/style'

export async function getServerSideProps(context) {
  const headParams = handleHeadParams(context)
  return { props: { ...headParams } }
}

const BrandSame = ({
  className,
  id,
  loading = true,
  options = [],
  remark,
  title,  
}) => {

  return <>
    <div className={classReader('mb-2')}>
      <h3 className={classReader('m-0 d-block d-sm-inline')}>{title}</h3>
      {remark && <span className={classReader('text-xs ml-sm-1')}>{remark}</span>}
    </div>
    

    {options.length > 0 && <div id={id} className={classReader({ AnalysisStyle: 'analysis-card' })}>
      {options?.map((option, index) => {
        option.sort = index + 1
        return <AnalysisCard
          key={index}
          className={className}
          id={`${id}-card-${index}`}
          cardData={option}
        />
      })}
    </div>}

    {options.length === 0 && <div id={id}>
      <div className={classReader('border rounded-8 pt-5 pb-5 text-center gray-6')}>
        {loading ? <ReactLoading
          className={classReader('my-5 m-auto loading-color')}
          type="spin"
          height={DEFAULT_SIZES.md * 2.5}
          width={DEFAULT_SIZES.md * 2.5}
        /> : '目前沒有資料' }
      </div>
    </div>}
    
  </>
}

BrandSame.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  loading: PropTypes.bool,
  options: PropTypes.array,
  remark: PropTypes.string,
  title: PropTypes.string,  
}

export default BrandSame