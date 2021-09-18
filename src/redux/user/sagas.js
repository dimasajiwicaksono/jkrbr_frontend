import { all, takeEvery, put, call } from 'redux-saga/effects'
import { Modal, notification } from 'antd'
import axios from 'axios'
import actions from './actions'
import config from '../../utils/config'
import { getHeader, getHeaderWoAuth } from '../../utils/master'
import { /* dummyFetchRequest, */ notifConfig } from '../../utils/helper'

async function GET_LOGIN(data) {

  return axios.post(config.API_LOGIN, data, { headers: getHeaderWoAuth() }).then(res => res.data)
}

async function GET_REGISTER(payload) {
  return axios.post(config.API_REGISTER, payload, { headers: getHeader() }).then(res => res.data)
}

async function GET_FORGOT(payload) {
  return axios
    .post(config.API_FORGOT, payload, { headers: getHeaderWoAuth() })
    .then(res => res.data)
}

async function GET_CHECK_TOKEN(params) {
  return axios
    .get(config.API_FORGOT_CHECK_TOKEN, { headers: getHeaderWoAuth({ token: params }) })
    .then(res => res.data)
}

function GET_API_OUTLET() {
  return axios.get(config.API_OUTLET, { headers: getHeaderWoAuth() }).then(res => res.data)
}

function GET_API_COMPANY() {
  return axios.get(config.API_COMPANY, { headers: getHeaderWoAuth() }).then(res => res.data)
}

function GET_API_CHANGE_PASSWORD(payload) {
  return axios
    .post(config.API_CHANGE_PASSWORD, payload, { headers: getHeader() })
    .then(res => res.data)
}

function GET_API_CHANGE_PIN(payload) {
  return axios.post(config.API_CHANGE_PIN, payload, { headers: getHeader() }).then(res => res.data)
}

function GET_API_RESET_PASSWORD(payload) {
  const body = {
    password: payload.password,
    repeatPassword: payload.repeatPassword,
  }
  return axios
    .post(config.API_RESET_PASSWORD, body, {
      headers: getHeaderWoAuth({ token: payload.token }),
    })
    .then(res => res.data)
}

function GET_API_CHANGE_COMPANY(payload) {
  return axios
    .post(config.API_CHANGE_COMPANY, payload, { headers: getHeader() })
    .then(res => res)
    .catch(error => error)
}

function GET_API_MST_COMPANY(payload) {
  return axios
    .post(config.API_MST_COMPANY_LIST, payload, { headers: getHeader() })
    .then(res => res.data)
}

export function* GET_MST_COMPANY({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingCompany: true,
    },
  })
  try {
    const result = yield call(GET_API_MST_COMPANY, payload)
    const { acknowledge, data, message } = result
    if (acknowledge === 1) {
      yield put({
        type: actions.SET_STATE,
        payload: {
          mstCompanyData: data,
        },
      })
    } else {
      notification.error({
        message: 'Failed',
        description: message,
      })
    }
  } catch (e) {
    console.log(e)
    notification.error({
      message: 'Failed',
      description: 'ERROR',
    })
  } finally {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loadingCompany: false,
      },
    })
  }
}

export function* LOGIN({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
    },
  })
  try {
    const result = yield call(GET_LOGIN, payload)
    const { acknowledge, message } = result
    if (acknowledge === 1) {
      notification.success({
        message: 'Login Success',
        description: `Welcome`,
        ...notifConfig,
      })
      /* Setting localStorage */
      localStorage.setItem('token', result.token)
      localStorage.setItem('authorized', true)
      yield put({
        type: actions.SET_STATE,
        payload: {
          loading: true,
          token: result.token,
          // role: 'admin',
          authorized: result.authorized,
        },
      })
    } else {
      notification.error({
        message: 'Failed',
        description: message,
        ...notifConfig,
      })
    }
  } catch (e) {
    console.log(e)
    notification.error({
      message: 'Failed',
      description: 'Something went wrong. Please try again later.',
      ...notifConfig,
    })
  } finally {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
      },
    })
  }
}

export function* REGISTER({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingRegister: true,
    },
  })
  try {
    const result = yield call(GET_REGISTER, payload)
    const { acknowledge, message } = result
    if (acknowledge === 1) {
      Modal.success({
        title: 'Register Success',
        content: 'Please check your Email',
      })
    } else {
      notification.error({
        message: 'Failed',
        description: message,
        ...notifConfig,
      })
    }
  } catch (e) {
    console.log(e)
    notification.error({
      message: 'Failed',
      description: 'Something went wrong. Please try again later.',
      ...notifConfig,
    })
  } finally {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loadingRegister: false,
      },
    })
  }
}

export function* FORGOT({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingFrgt: true,
    },
  })
  try {
    const result = yield call(GET_FORGOT, payload)
    const { acknowledge, message } = result
    if (acknowledge === 1) {
      notification.success({
        message: 'Success',
        description: `Please check your email.`,
        ...notifConfig,
      })
    } else {
      notification.error({
        message: 'Failed',
        description: message,
        ...notifConfig,
      })
    }
  } catch (e) {
    console.log(e)
    notification.error({
      message: 'Failed',
      description: 'Something went wrong. Please try again later.',
      ...notifConfig,
    })
  } finally {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loadingFrgt: false,
      },
    })
  }
}

export function* CHECK_TOKEN({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingCheckToken: true,
    },
  })
  try {
    const { token } = payload
    const result = yield call(GET_CHECK_TOKEN, token)
    const { acknowledge, message } = result
    if (acknowledge === 0) {
      notification.error({
        message: 'Failed',
        description: message,
        ...notifConfig,
      })
    }
  } catch (e) {
    console.log(e)
    notification.error({
      message: 'Failed',
      description: 'Something went wrong. Please try again later.',
      ...notifConfig,
    })
  } finally {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loadingCheckToken: false,
      },
    })
  }
}

export function* RESET_PASSWORD({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingChgPwd: true,
    },
  })
  try {
    const result = yield call(GET_API_RESET_PASSWORD, payload)
    const { acknowledge, message } = result
    if (acknowledge === 1) {
      yield put({
        type: actions.SET_STATE,
        payload: {
          isSuccessChgPwd: true,
        },
      })
      notification.success({
        message: 'Success',
        description: message,
        ...notifConfig,
      })
    } else {
      notification.error({
        message: 'Failed',
        description: message,
        ...notifConfig,
      })
    }
  } catch (e) {
    console.log(e)
    notification.error({
      message: 'Failed',
      description: `Something went wrong.`,
      ...notifConfig,
    })
  } finally {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loadingChgPwd: false,
      },
    })
  }
}

export function* GET_OUTLET() {
  try {
    const data = yield call(GET_API_OUTLET)
    const list = []
    data.data.map(val =>
      list.push({
        outletCode: val.outletCode,
        outletName: val.outletName,
      }),
    )
    yield put({
      type: actions.SET_STATE,
      payload: {
        outlet: list,
      },
    })
  } catch (e) {
    console.log(e)
    notification.error({
      message: 'Failed',
      description: `Something went wrong.`,
      ...notifConfig,
    })
  }
}

export function* GET_COMPANY() {
  try {
    const data = yield call(GET_API_COMPANY)
    const list = []
    data.data.map(val =>
      list.push({
        compCode: val.compCode,
        compName: val.compName,
      }),
    )
    yield put({
      type: actions.SET_STATE,
      payload: {
        company: list,
      },
    })
  } catch (e) {
    console.log(e.message)
    notification.error({
      message: 'Failed',
      description: `Failed to get company data.`,
      ...notifConfig,
    })
  }
}

export function* GET_CHANGE_COMPANY({ payload }) {
  const { compCode } = payload
  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
    },
  })
  try {
    const result = yield call(GET_API_CHANGE_COMPANY, payload)
    const { acknowledge, message, token, username } = result.data
    const { dateOpening } = result.data.config
    const { status } = result
    if (acknowledge === 1) {
      const tokenData = JSON.parse(atob(token.split('.')[1]))
      notification.success({
        message: 'Login Success',
        description: `Welcome ${username} in ${tokenData.compName}`,
        ...notifConfig,
      })
      /* Setting localStorage */
      localStorage.setItem('token', token)
      localStorage.setItem('username', username)
      localStorage.setItem('compCode', compCode)
      localStorage.setItem('authorized', true)
      localStorage.setItem('dateOpening', dateOpening)

      yield put({
        type: actions.SET_STATE,
        payload: {
          status,
          loading: true,
          token,
          username,
          role: 'admin',
          config: {
            dateOpening,
          },
          authorized: true,
        },
      })
    } else {
      notification.error({
        message: 'Failed',
        description: message,
        ...notifConfig,
      })
    }
  } catch (e) {
    console.log(e.name)
    console.log(e.message)
    yield put({
      type: actions.SET_STATE,
      payload: {
        status: '',
        loading: false,
      },
    })
    notification.error({
      message: 'Failed',
      description: 'Something went wrong. Please try again later.',
      ...notifConfig,
    })
  } finally {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
      },
    })
  }
}

export function* USER_CHANGE_PASSWORD({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingChgPwd: true,
    },
  })
  try {
    const result = yield call(GET_API_CHANGE_PASSWORD, payload)
    const { acknowledge, message } = result
    if (acknowledge === 1) {
      notification.success({
        message: 'Success',
        description: message,
        ...notifConfig,
      })
    } else {
      notification.error({
        message: 'Failed',
        description: message,
        ...notifConfig,
      })
    }
  } catch (e) {
    console.log(e)
    notification.error({
      message: 'Failed',
      description: `Something went wrong.`,
      ...notifConfig,
    })
  } finally {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loadingChgPwd: false,
      },
    })
  }
}

export function* USER_CHANGE_PIN({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingChgPIN: true,
    },
  })
  try {
    const result = yield call(GET_API_CHANGE_PIN, payload)
    const { acknowledge, message } = result
    if (acknowledge === 1) {
      notification.success({
        message: 'Success',
        description: message,
        ...notifConfig,
      })
    } else {
      notification.error({
        message: 'Failed',
        description: message,
        ...notifConfig,
      })
    }
  } catch (e) {
    console.log(e)
    notification.error({
      message: 'Failed',
      description: `Something went wrong.`,
      ...notifConfig,
    })
  } finally {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loadingChgPIN: false,
      },
    })
  }
}

export function* LOAD_CURRENT_ACCOUNT() {
  const token = localStorage.getItem('token') ? localStorage.getItem('token') : ''
  const username = localStorage.getItem('username') ? localStorage.getItem('username') : ''
  const authorized = localStorage.getItem('authorized') === 'true'
  const dateOpening = localStorage.getItem('dateOpening') ? localStorage.getItem('dateOpening') : ''

  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
    },
  })
  yield put({
    type: actions.SET_STATE,
    payload: {
      token,
      username,
      role: 'admin',
      authorized,
      config: {
        dateOpening,
      },
    },
  })
  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: false,
    },
  })
}

export function* LOGOUT() {
  localStorage.clear()
  yield put({
    type: actions.SET_STATE,
    payload: {
      token: '',
      username: '',
      role: '',
      authorized: false,
      loading: false,
    },
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN, LOGIN),
    takeEvery(actions.LOGOUT, LOGOUT),
    takeEvery(actions.FORGOT, FORGOT),
    takeEvery(actions.CHECK_TOKEN, CHECK_TOKEN),
    takeEvery(actions.RESET_PASSWORD, RESET_PASSWORD),
    takeEvery(actions.CHANGE_COMPANY, GET_CHANGE_COMPANY),
    takeEvery('user/GET_OUTLET', GET_OUTLET),
    takeEvery('user/GET_COMPANY', GET_COMPANY),
    takeEvery('user/USER_CHANGE_PASSWORD', USER_CHANGE_PASSWORD),
    takeEvery(actions.USER_CHANGE_PIN, USER_CHANGE_PIN),
    takeEvery(actions.LOAD_CURRENT_ACCOUNT, LOAD_CURRENT_ACCOUNT),
    takeEvery(actions.GET_MST_COMPANY, GET_MST_COMPANY),
    takeEvery(actions.REGISTER, REGISTER),
    LOAD_CURRENT_ACCOUNT(),
  ])
}
