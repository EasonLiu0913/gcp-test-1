import React, { useEffect, useRef } from 'react'
import CardSection from 'common/card/CardSection'
import classReader from 'utils/classReader'
import QRCode from 'common/QRCode'
import RollingNumber from 'common/RollingNumber'
import { rules } from 'utils/validation'
const DetailCard = ({
  createDate,
  createUserMail,
  createUserName,
  destUrl,
  expiryDate,
  shortenerUrl,
  tags,
  title,
  totalClick,
  totalClickHidden,
  totalLabel,  
}) => {

  return (
    <div>
      <CardSection className={classReader({ ShortenerStyle: 'detail-card' }, 'p-0 pl-2 pr-2 pl-sm-3 pr-sm-3')}>
        <div className={classReader({ ShortenerStyle: 'qr-code' })}>
          {shortenerUrl && <QRCode data={shortenerUrl} width={180}/>}
        </div>
        <div className={classReader({ ShortenerStyle: 'shorten-url-data' })}>
          <div className={classReader({ ShortenerStyle: 'row' }, 'primary text-h6 text-lg-h5')}>你的短網址：{shortenerUrl}</div>
          <div className={classReader({ ShortenerStyle: 'row' })}>
            <div className={classReader({ ShortenerStyle: 'column-name' }, 'text-sm text-sm-md')}>目標網址</div>：{decodeURIComponent(destUrl)}
          </div>
          <div className={classReader({ ShortenerStyle: 'row' })}>
            <div className={classReader({ ShortenerStyle: 'column-name column-name__extend-2' }, 'text-sm text-sm-md')}>標題</div>：{title}
          </div>
          <div className={classReader({ ShortenerStyle: 'row' })}>
            <div className={classReader({ ShortenerStyle: 'column-name' }, 'text-sm text-sm-md')}>建立日期</div>：{createDate}
          </div>
          <div className={classReader({ ShortenerStyle: 'row' })}>
            <div className={classReader({ ShortenerStyle: 'column-name' }, 'text-sm text-sm-md')}>下架日期</div>：{expiryDate}
          </div>
          <div className={classReader({ ShortenerStyle: 'row' })}>
            <div className={classReader({ ShortenerStyle: 'column-name column-name__extend-2' }, 'text-sm text-sm-md')}>標籤</div>：
            <div className={classReader({ ShortenerStyle: 'tag-row' })}>
              {tags?.map((tag, index) => (
                <div className={classReader('text-tag text-primary text-sm text-sm-md')} key={index}>
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={classReader({ ShortenerStyle: 'user-data' })}>
          <div className={classReader('d-block d-md-flex flex-row')}>
            <div className={classReader('ml-2 d-flex flex-column justify-content-center')}>
              <div className={classReader('h5 d-block d-md-flex text-center align-items-center mb-2 pt-1')}>{createUserName}</div>
              <div className={classReader('text-secondary')}>{createUserMail}</div>
            </div>
          </div>
          {!rules.required(totalClickHidden) && <div className={classReader({ ShortenerStyle: 'figure-block' })}>
            {
              Number.isInteger(totalClick) ?
                <div className={classReader('primary h3 bold mb-1')}>{<RollingNumber number={totalClick}/>}</div> :
                <div className={classReader('text-tag bg-gray-5 text-secondary')}>暫無資料</div>
            }
            <div className={classReader('primary h6')}>{totalLabel || '總點擊數'}</div>
          </div>}
          
        </div>
      </CardSection>
    </div>
  )
}

export default DetailCard