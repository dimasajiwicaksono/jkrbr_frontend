import * as moment from 'moment'
import * as XLSX from 'xlsx'
import { notification } from 'antd'

export function getUnique(arr, comp) {
  const unique = arr
    .map(e => e[comp])
    .map((e, i, final) => final.indexOf(e) === i && i)
    .filter(e => arr[e])
    .map(e => arr[e])
  return unique
}

export const dateFormat = {
  formatDateTimeID: 'DD-MM-YYYY HH:mm:ss',
  formatDateID: 'DD-MM-YYYY',
  formatDate: 'YYYY-MM-DD',
  formatMonthNameID: 'MMM-YYYY',
  formatMonthNumID: 'MM-YYYY',
  formatFullDate: 'DD MMMM YYYY',
}

export const notifConfig = {
  duration: 3,
  placement: 'topRight',
}

export const paginationConfig = {
  pageSize: 50,
}

export const datePeriod = {
  startMonthID: moment()
    .startOf('month')
    .format(dateFormat.formatDateID),
  endMonthID: moment()
    .endOf('month')
    .format(dateFormat.formatDateID),
  todayFullDate: moment().format(dateFormat.formatFullDate),
  todayID: moment().format(dateFormat.formatDateID),
  nowID: moment().format(dateFormat.formatDateTimeID),
  currentMonthNameID: moment().format(dateFormat.formatMonthNameID),
  currentMonthNumID: moment().format(dateFormat.formatMonthNumID),
}

export function currencyFormat(param, tf) {
  const toFixed = tf !== undefined ? tf : 2
  const str = Number(param)
    .toFixed(toFixed)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  return str
}

export function handleSearchLabel(expand) {
  if (expand === false) {
    return 'Search'
  }
  return 'Hide Search'
}

export function handleAccess(obj, isAccess) {
  let result = false
  if (isAccess === 'isView') {
    if (obj.isNew === '1') {
      result = true
    }
  }
  if (isAccess === 'isNew') {
    if (obj.isNew === '1') {
      result = true
    }
  }
  if (isAccess === 'isEdit') {
    if (obj.isEdit === '1') {
      result = true
    }
  }
  if (isAccess === 'isDelete') {
    if (obj.isDelete === '1') {
      result = true
    }
  }
  if (isAccess === 'isPosting') {
    if (obj.isPosting === '1') {
      result = true
    }
  }
  if (isAccess === 'isUnPosting') {
    if (obj.isUnPosting === '1') {
      result = true
    }
  }
  if (isAccess === 'isPosting1') {
    if (obj.isPosting1 === '1') {
      result = true
    }
  }
  if (isAccess === 'isUnPosting1') {
    if (obj.isUnPosting1 === '1') {
      result = true
    }
  }
  if (isAccess === 'isPosting2') {
    if (obj.isPosting2 === '1') {
      result = true
    }
  }
  if (isAccess === 'isUnPosting2') {
    if (obj.isUnPosting2 === '1') {
      result = true
    }
  }
  if (isAccess === 'isDownload') {
    if (obj.isDownload === '1') {
      result = true
    }
  }
  if (isAccess === 'isUpload') {
    if (obj.isUpload === '1') {
      result = true
    }
  }
  if (isAccess === 'isDor') {
    if (obj.isDOR === '1') {
      result = true
    }
  }
  return result
}

export function sideMenuFilter(menu, keyTop, keySide, keySide2 = null) {
  const result = menu.menuSideData
    .filter(x => x.key === keyTop)[0]
    .children.filter(y => y.key === keySide)[0]

  if (keySide2 !== null) {
    const result2 = result.children.filter(y => y.key === keySide2)[0]
    return result2
  }
  return result
}

export function getFirstBrand(brands) {
  let result = ''
  if (brands !== undefined && brands.length === 1) {
    result = brands[0].brandCode
  }
  console.log(result, 'result')
  return result
}

export function parseCurrency(num) {
  return parseFloat(num.replace(/,/g, ''))
}

export function urlToArray(url) {
  if (url !== '') {
    const request = {}
    const pairs = url.substring(url.indexOf('?') + 1).split('&')
    for (let i = 0; i < pairs.length; i += 1) {
      if (!pairs[i]) i += 1
      const pair = pairs[i].split('=')
      request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1])
    }
    return request
  }
  return false
}

export function excelToJson(payload) {
  /** reader =>  [FileReader]:File
   * event => [{File: blob, event: Obj}] */
  const { reader, event } = payload
  const fileData = reader.result

  /** Parsing Data */
  const wb = XLSX.read(fileData, { type: 'binary' })
  const data = {}

  /** Iterate Sheet in WorkSheet and get sheet in worksheet
   * e.g. Sheet1, Sheet2 ..etc */
  wb.SheetNames.forEach(sheetName => {
    const isSheet = wb.SheetNames.includes(event.sheet)
    /** Convert array of array */
    data[sheetName] = XLSX.utils.sheet_to_json(wb.Sheets[sheetName])

    /** notif when sheetName not exist in workbook list */
    if (sheetName !== event.sheet && !isSheet) {
      notification.warning({
        message: 'Please Check you SheetName',
        description: `Do you mean ${sheetName} ?`,
      })
    }
  })
  return data[event.sheet]
  /**  Return array by sheetName
   *  in this case you can passing sheet name from event */
}

export const loadFileXLSX = event =>
  new Promise((resolve, reject) => {
    /** Boilerplate to set up FileReader */
    const reader = new FileReader()
    const rABS = !!reader.readAsBinaryString

    /** Promise for handling resolve dan reject event
     * and passing param (reader, event) for send to sagas */
    reader.onload = () => resolve({ reader, event })
    reader.onerror = error => reject(error)

    /** convert file to Binary string */
    if (rABS) reader.readAsBinaryString(event.files)
    else reader.readAsArrayBuffer(event.files)
  })

/* list of supported file types */
export const SheetJSFT = [
  'xlsx',
  'xlsb',
  'xlsm',
  'xls',
  'xml',
  'csv',
  'txt',
  'ods',
  'fods',
  'uos',
  'sylk',
  'dif',
  'dbf',
  'prn',
  'qpw',
  '123',
  'wb*',
  'wq*',
  'html',
  'htm',
]
  .map(x => `.${x}`)
  .join(',')

export function blob(wb) {
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })
  return new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
}

export const fileName = (title, no = '', compName = '') =>
  `${title}${no === '' ? '' : '_'}${no}
    ${compName === '' ? '' : '_'}${compName}.xlsx`

/* eslint-disable */
export function s2ab(s) {
  const buffer = new ArrayBuffer(s.length)
  const view = new Uint8Array(buffer)
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff
  return buffer
}
/* eslint-enable */

export function currFormatCell(ws, range) {
  const fmt = '#,##0.00;(#,##0.00)'
  /* eslint-disable */
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      /* eslint-enable */
      const cell = XLSX.utils.encode_cell({ r: R, c: C })
      /** ONLY ASSIGN if Type Cell Address is Number */
      if (ws[cell].t === 'n' && ws[cell] !== undefined) {
        ws[cell].z = fmt
      }
      if (ws[cell].t === 's') {
        ws[cell].s = {
          font: {
            bold: true,
          },
        }
      }
    }
  }
}

export function dummyFetchRequest(response, time = 3000) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ ...response })
    }, time)
  })
}

export const helper = {
  getUnique,
  dateFormat,
  datePeriod,
  currencyFormat,
  handleSearchLabel,
  handleAccess,
  sideMenuFilter,
  notifConfig,
  paginationConfig,
  getFirstBrand,
  urlToArray,
  excelToJson,
  loadFileXLSX,
  SheetJSFT,
  s2ab,
  blob,
  fileName,
  currFormatCell,
  parseCurrency,
  dummyFetchRequest,
}
