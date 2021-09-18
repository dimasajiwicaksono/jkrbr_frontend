import config from './config'

export function getHeader() {
  let auth
  const token = localStorage.getItem('token')
  const compCode =
    localStorage.getItem('compCode') !== '' || localStorage.getItem('compCode') !== undefined
      ? localStorage.getItem('compCode')
      : ''
  if (token === undefined || token === '') {
    auth = ''
  } else {
    auth = `Bearer ${token}`
  }
  return {
    Authorization: auth,
    CompCode: compCode,
    'Content-Type': 'application/json',
    AppSchema: config.APPSCHEMA,
  }
}

export function getHeaderWoAuth(params) {
  const compCode =
    localStorage.getItem('compCode') !== '' || localStorage.getItem('compCode') !== undefined
      ? localStorage.getItem('compCode')
      : ''
  return {
    CompCode: compCode,
    'Content-Type': 'application/json',
    ...params,
  }
}

export function getHeaderMultipart() {
  let auth
  const token = localStorage.getItem('token')
  const compCode =
    localStorage.getItem('compCode') !== '' || localStorage.getItem('compCode') !== undefined
      ? localStorage.getItem('compCode')
      : ''
  if (token === undefined || token === '') {
    auth = ''
  } else {
    auth = `Bearer ${token}`
  }
  return {
    Authorization: auth,
    CompCode: compCode,
    'Content-Type': 'multipart/form-data',
  }
}

export function setToken(param) {
  localStorage.setItem('Token', param)
}

export const master = {
  getHeader,
  getHeaderWoAuth,
  getHeaderMultipart,
}
