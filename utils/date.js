import { rules } from './validation'

/*
 * 日期時間相關驗證判斷 /格式轉換
 *  ├ 待補充
 *  └ 待補充
 */
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { DateObject } from 'react-multi-date-picker'
import {
  DATETIME_API_FORMAT,
  DATETIME_FORMAT,
  DATE_FORMAT,
  TIME_FORMAT, 
} from 'config/date'

dayjs.extend(utc)
dayjs.extend(timezone)

/* 
 * 為解決 timezone 問題，所有時間將通過 handleDateFormat 來進行轉換
 * 時間將預設台灣時間，並保留參數，以便日後多語系(地區)使用
 * dateTime: dateTime,
 * add: add,
 * format: DATE_FORMAT,
 * unit: 'day',
 * tz: 'Asia/Taipei'
 * timezone: true
 */
export const handleDateFormat = (props) => {
  const data = {
    dateTime: props?.dateTime,
    add: props.add || 0,
    format: props.format || DATE_FORMAT,
    unit: props.unit || 'day',
    tz: props.tz || 'Asia/Taipei',
    timezone: props.timezone || true,
  }

  let time = ''

  if (dayjs.isDayjs(data.dateTime)) {
    // 輸入 Day.js 時間格式，用於時間套件 
    time = data.dateTime
  } else if (data.dateTime === 'now') {
    // 輸入 now ，取得當下時間
    time = dayjs().tz(data.tz)
  } else if (typeof data.dateTime === 'string') {
    // 輸入時間字符串，去除 utc 標記，並將時間轉換為台北時間
    data.dateTime = data.dateTime.replace(/\.\d+Z|Z/, '')
    time = data.timezone ? dayjs(data.dateTime).tz('Asia/Taipei') : data.dateTime
  } else {
    // 非法輸入，回傳錯誤訊息
    return ''
  }
  
  // 時間偏移，依據需求增減時間
  if (data.add !== 0 && typeof data.add === 'number') time = time.add(data.add, data.unit)
  if (data.add === 'end' ) time = time.endOf(data.unit)

  // 轉換指定時間格式
  return time.format(data.format)
}

// return format 'YYYY-MM-DD'
export const dateFormat = (dateTime, add = 0) => {
  return handleDateFormat({
    dateTime: dateTime,
    add: add,
    format: DATE_FORMAT,
  })
}

// return format 'HH:mm:ss'
export const timeFormat = (
  dateTime, add, unit,
) => {
  return handleDateFormat({
    dateTime: dateTime,
    add: add,
    unit: unit,
    format: TIME_FORMAT,
  })
}

// return format 'YYYY-MM-DD HH:mm:ss'
export const dateTimeFormat = (
  dateTime, add = 0, unit,
) => {
  let time = handleDateFormat({
    dateTime: dateTime,
    add: add,
    unit: unit,
    format: DATETIME_FORMAT,
  })

  return time
}

// return format 'YYYY-MM-DDTHH:mm:ss'
export const dateTimeApiFormat = (
  dateTime, add = 0, unit,
) => {
  return handleDateFormat({
    dateTime: dateTime,
    add: add,
    unit: unit,
    format: DATETIME_API_FORMAT,
  })
}

// checkDate > sortDate = true
export const isAfterDate = (checkDate, sortDate) => {
  return dayjs(dateTimeFormat(checkDate)).isAfter(dateTimeFormat(sortDate))
}

// checkDate < sortDate = true
export const isBeforeDate = (checkDate, sortDate) => {
  return dayjs(dateTimeFormat(checkDate)).isBefore(dateTimeFormat(sortDate))
}

// limit original format by 'YYYYMMDD HHmmSS'
export const convertToHotaiDateFormat = (date, time) => {
  let formatDate = ''
  let formatTime = ''

  if (Boolean(date)) {
    const year = date.slice(0, 4)
    const month = date.slice(4, 6)
    const day = date.slice(6)

    formatDate = `${year}-${month}-${day}`
  }

  if (Boolean(time)) {
    const hour = time.slice(0, 2)
    const minutes = time.slice(2, 4)
    const second = time.slice(4)
    formatTime = `${Boolean(date) ? ' ' : ''}${hour}:${minutes}:${second}`
  }

  return formatDate + formatTime
}

// handle react-multi-date-picker value
// limitRange : type number, only for prev range
export const convertCalendarRange = (range = [], limitRange) => {
  const dateFrom = range[0]
  const dateTo = range[1]
  let dateFromString = ''
  let dateToString = ''

  if (Boolean(limitRange)) {
    const limitDateFrom = dateFrom || new DateObject().subtract(limitRange, 'days')
    const limitDateTo = dateTo || new DateObject()
    dateFromString = limitDateFrom.format(DATE_FORMAT)
    dateToString = limitDateTo.format(DATE_FORMAT)

    // check if overRange
    const maxDateToString = new DateObject(dateFrom).add(limitRange, 'days').format(DATE_FORMAT)
    if (dateToString > maxDateToString) return ''
  } else {
    if (Boolean(dateFrom)) dateFromString = dateFrom.format(DATE_FORMAT)
    if (Boolean(dateTo)) dateToString = dateTo.format(DATE_FORMAT)
  }

  const timeDash = Boolean(dateToString) ? ' ~ ' : ''
  return dateFromString + timeDash + dateToString
}

export const convertCalendar = (date) => {
  const dateFrom = range[0]
  const dateTo = range[1]
  let dateFromString = ''
  let dateToString = ''

  if (Boolean(limitRange)) {
    const limitDateFrom = dateFrom || new DateObject().subtract(limitRange, 'days')
    const limitDateTo = dateTo || new DateObject()
    dateFromString = limitDateFrom.format(DATE_FORMAT)
    dateToString = limitDateTo.format(DATE_FORMAT)

    // check if overRange
    const maxDateToString = new DateObject(dateFrom).add(limitRange, 'days').format(DATE_FORMAT)
    if (dateToString > maxDateToString) return ''
  } else {
    if (Boolean(dateFrom)) dateFromString = dateFrom.format(DATE_FORMAT)
    if (Boolean(dateTo)) dateToString = dateTo.format(DATE_FORMAT)
  }

  const timeDash = Boolean(dateToString) ? ' ~ ' : ''
  return dateFromString + timeDash + dateToString
}

export const handleInTime = (
  startTime,
  endTime,
  transitionStart,
  transitionEnd,
) => {
  const format = 'YYYYMMDDHHmmss'

  const defaultTime = [
    '9999', // YYYY
    '99', // MM
    '99', // DD
    '00', // HH
    '00', // mm
    '00', // ss
  ].join('')

  const invalidValue = [
    '',
    null,
    undefined,
    NaN,
  ]

  const transitionSeconds = {
    start: invalidValue.includes(parseInt(transitionStart)) ? 0 : 0 - parseInt(transitionStart),
    end: invalidValue.includes(parseInt(transitionEnd)) ? 0 : parseInt(transitionEnd),
  }

  const today = dayjs().tz('Asia/Taipei').format(format)

  const start = invalidValue.includes(startTime) ? defaultTime : handleDateFormat({
    dateTime: startTime,
    add: transitionSeconds.start,
    format: format,
    unit: 'second',
  })

  const end = invalidValue.includes(endTime) ? defaultTime : handleDateFormat({
    dateTime: endTime,
    add: transitionSeconds.end,
    format: format,
    unit: 'second',
  })

  return today >= start && today < end
}

export const getCurrentTimestamp = () => {
  return dayjs().valueOf()
}