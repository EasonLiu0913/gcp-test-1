import React, { memo } from 'react'
import PropTypes from 'prop-types'
import classReader from 'utils/classReader'

const Breadcrumbs = ({
  className,
  id,
  options,
  styleName = '',
  title,
}) => {

  return <>
    {/* <h1 className={classReader('h4 m-0')}>{title}</h1> */}
    <section className={classReader('breadcrumbs public-padding', className)} id={id}>
      <h1 className={classReader('h4 m-0')}>{title}</h1>
     
      {/*   
      <ol
        className={classReader('breadcrumbs__list mt-1')}
        vocab="https://schema.org/"
        typeof="BreadcrumbList"
      >        
        {options?.map((option, index) => {
          const isLastOption = options.length - 1 === index
          const breadcrumbColor = option.color || 'primary'
          return (
            <li
              key={index}
              className={classReader('breadcrumbs__el ellipsis',
                { [`text-${breadcrumbColor}`]: isLastOption === false })}
              id={options?.id}
              property="itemListElement"
              typeof="ListItem"
            >
              {!!option.icon && (
                <i className={
                  classReader(
                    `icon icon-${option.icon} icon-sm`,
                    { [`icon-${breadcrumbColor}`]: isLastOption === false },
                    { 'mr-2': Boolean(option.label) },
                  )}
                />
              )}

              {Boolean(option.link)
                ? (
                  <a
                    className={classReader({ [`CommonStyle ${styleName}`]: 'breadcrumbs__item' }, 'ellipsis')} // can overwritten this className style
                    id={options?.id}
                    href={option.link}
                    property="item"
                    typeof="WebPage"
                  >
                    <span property="name">{option.label}</span>
                  </a>
                ) : (
                  <span className={classReader({ [`CommonStyle ${styleName}`]: 'breadcrumbs__item' }, 'ellipsis')} property="name"> 
                    {
                    // can overwritten this className style
                    }
                    {option.label}
                  </span>
                )
              }

              {isLastOption === false && <i className={classReader('icon icon-arrow-right icon-gray-6 mx-1')}></i>}

              <meta property="position" content={index + 1} />
            </li>
          )
        })}
      </ol> */}
    
    </section>
  </>
}

Breadcrumbs.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  options: PropTypes.array,
  styleName: PropTypes.string,
  title: PropTypes.string,
}

export default memo(Breadcrumbs)