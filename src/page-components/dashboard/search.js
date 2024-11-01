import React, { useState } from 'react'
import {
  handleHeadParams,
  lastSegmentOfURL, 
} from 'utils/util'
import classReader from 'utils/classReader'
import Input from 'common/form/Input'
import Button from 'common/Button'
import Modal from 'common/Modal'
import Link from 'next/link'
import dashboardAPI from 'apis/dashboard'
import { useForm } from 'react-hook-form'
import { USE_FORM_CONFIG } from 'config/config'
import { rules } from 'utils/validation'
import { useError } from 'context/ErrorContext'
import { hookFormValidates } from 'utils/hookFormValidates'

export async function getServerSideProps(context) {
  const headParams = handleHeadParams(context)
  return { props: { ...headParams } }
}

const Search = () => {
  const [isDlgOpen, setIsDlgOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [data, setData] = useState({})
  const { reportError } = useError()

  const {
    register, handleSubmit, formState: { errors }, 
  } = useForm({
    ...USE_FORM_CONFIG,
    mode: 'onSubmit',
  })

  const handleSearch = async (data) => {
    setIsSubmitting(true)
    try {
      const result = await dashboardAPI.getKeywordCount(data)
      if (!result.success) return reportError({ errorNo: result.errorNo || 9999 })

      setData(result.data)
      setIsDlgOpen(true)

    } catch (err) {
      reportError(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return <section className={classReader('bg-info-light p-4 pb-sm-5 pt-sm-5 p-lg-5  rounded', { DashboardStyle: 'search' })}>
    <div className={classReader('h3')}>快速查詢短網址</div>
    <div className={classReader('text-secondary mt-1 mb-3')}>輸入關於短網址、標題、標籤等關鍵字，將為您查詢過去短網址</div>
    <div className={classReader('d-flex', { DashboardStyle: 'search-bar-wrapper' })}>
      <Input
        className={classReader('mb-0', { DashboardStyle: 'search-bar' })}
        placeholder="請輸入相關關鍵字"
        register={register}
        name="keyword"
        validate={hookFormValidates().codeRequired}
        controllerError={errors?.keyword?.message}
      />
      <Button
        className={classReader('m-0', { DashboardStyle: 'search-btn' })}
        isLoading={isSubmitting}
        label="搜尋"
        onClick={handleSubmit(handleSearch)}
      />
    </div>

    <Modal
      prompt={isDlgOpen}
      title="查詢結果"
      width={500}
      onClose={() => setIsDlgOpen(false)}
      close>
      <div className={classReader({ DashboardStyle: 'modal-content' })}>
        <p className={classReader('text-secondary mt-0')}>
        以下是關鍵字
          <span className={classReader('orange mx-1')}>「{data.keyword}」</span>
          相關查詢結果，點擊 <i className={classReader('icon icon-search icon-sm')} /> 查看詳細資訊
        </p>
        <div className={classReader(
          'row', { DashboardStyle: 'search__results' }, 'scrollbar-y',
        )}>

          <div className={classReader('col-12 mb-3')}>
            <div className={classReader('h5 bold mb-2')}>單一短網址</div>
            <div className={classReader('row')}>
              <div className={classReader('col-6 col-sm-4')}>
                <Link href={`/shortener/manage?title=${data.keyword}&createKind=0`}>
                  <div className={classReader({ DashboardStyle: 'search__results__item' }, 'border rounded-8 p-2 m-1')}>
                    <div className={classReader(
                      { DashboardStyle: 'search__results__item__const' },
                      'text-center text-lg text-sm-xl',
                      data.single?.title ? 'primary' : 'gray-6',
                    )}>{data.single?.title ?? 0} 筆</div>
                    <div className={classReader({ DashboardStyle: 'search__results__item__title' }, 'd-flex justify-content-center align-items-center text-sm pt-2 pt-sm-3')}>
                      <i className={classReader('icon icon-stroke-search icon-gray-7 icon-xs icon-sm-sm mr-1')} />標題
                    </div>
                  </div>
                </Link>
              </div>

              <div className={classReader('col-6 col-sm-4')}>
                <Link href={`/shortener/manage?tags=${data.keyword}&createKind=0`}>
                  <div className={classReader({ DashboardStyle: 'search__results__item' }, 'border rounded-8 p-2 m-1')}>
                    <div className={classReader(
                      { DashboardStyle: 'search__results__item__const' },
                      'text-center text-lg text-sm-xl',
                      data.single?.tag ? 'primary' : 'gray-6',
                    )}>{data.single?.tag ?? 0} 筆</div>
                    <div className={classReader({ DashboardStyle: 'search__results__item__title' }, 'd-flex justify-content-center align-items-center text-sm pt-2 pt-sm-3')}>
                      <i className={classReader('icon icon-stroke-search icon-gray-7 icon-xs icon-sm-sm mr-1')} />標籤
                    </div>
                  </div>
                </Link>
              </div>

              <div className={classReader('col-6 col-sm-4')}>
                <Link href={`/shortener/manage?code=${data.keyword}&createKind=0`}>
                  <div className={classReader({ DashboardStyle: 'search__results__item' }, 'border rounded-8 p-2 m-1')}>
                    <div className={classReader(
                      { DashboardStyle: 'search__results__item__const' }, 
                      'text-center text-lg text-sm-xl',
                      data.single?.code ? 'primary' : 'gray-6',
                    )}>{data.single?.code ?? 0} 筆</div>
                    <div className={classReader({ DashboardStyle: 'search__results__item__title' }, 'd-flex justify-content-center align-items-center text-sm pt-2 pt-sm-3')}>
                      <i className={classReader('icon icon-stroke-search icon-gray-7 icon-xs icon-sm-sm mr-1')} />短網址
                    </div>
                  </div>
                </Link>
              </div>

              {/* <div className={classReader('col-6 col-sm-3')}>
                <Link href={`/shortener/manage?destUrl=${data.keyword}&createKind=0`}>
                  <div className={classReader({ DashboardStyle: 'search__results__item' }, 'border rounded-8 p-2 m-1')}>
                    <div className={classReader(
                      { DashboardStyle: 'search__results__item__const' },
                      'text-center text-lg text-sm-xl',
                      data.single?.destUrl ? 'primary' : 'gray-6',
                    )}>{data.single?.destUrl ?? 0} 筆</div>
                    <div className={classReader({ DashboardStyle: 'search__results__item__title' }, 'd-flex justify-content-center align-items-center text-sm pt-2 pt-sm-3')}>
                      <i className={classReader('icon icon-stroke-search icon-gray-7 icon-xs icon-sm-sm mr-1')} />目標網址
                    </div>
                  </div>
                </Link>
              </div> */}
            </div>
          </div>

          <div className={classReader('col-12 col-sm-6 mb-3')}>
            <div className={classReader('h5 bold mb-2')}>量產短網址</div>
            <div className={classReader('row')}>
              <div className={classReader('col-12')}>
                <Link href={`/shortener/batch?batchName=${data.keyword}`}>
                  <div className={classReader({ DashboardStyle: 'search__results__item' }, 'border rounded-8 p-2 m-1')}>
                    <div className={classReader(
                      { DashboardStyle: 'search__results__item__const' },
                      'text-center text-lg text-sm-xl',
                      data.batch?.batchName ? 'primary' : 'gray-6',
                    )}>{data.batch?.batchName ?? 0} 筆</div>
                    <div className={classReader({ DashboardStyle: 'search__results__item__title' }, 'd-flex justify-content-center align-items-center text-sm pt-2 pt-sm-3')}>
                      <i className={classReader('icon icon-stroke-search icon-gray-7 icon-xs icon-sm-sm mr-1')} /> 量產短網址名稱
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className={classReader('col-12 col-sm-6 mb-3')}>
            <div className={classReader('h5 bold mb-2')}>1:1個人化短網址</div>
            <div className={classReader('row')}>
              <div className={classReader('col-12')}>
                <Link href={`/shortener/one-on-one?campaignName=${data.keyword}`}>
                  <div className={classReader({ DashboardStyle: 'search__results__item' }, 'border rounded-8 p-2 m-1')}>
                    <div className={classReader(
                      { DashboardStyle: 'search__results__item__const' },
                      'text-center text-lg text-sm-xl',
                      data.individual?.campaignName?.title ? 'primary' : 'gray-6',
                    )}>{data.individual?.campaignName ?? 0} 筆</div>
                    <div className={classReader({ DashboardStyle: 'search__results__item__title' }, 'd-flex justify-content-center align-items-center text-sm pt-2 pt-sm-3')}>
                      <i className={classReader('icon icon-stroke-search icon-gray-7 icon-xs icon-sm-sm mr-1')} />相關行銷活動名稱
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

        </div> 
      </div>
    </Modal>
  </section>
}
export default Search