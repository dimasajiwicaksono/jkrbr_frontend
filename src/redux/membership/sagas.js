import { all, put, call, takeEvery } from 'redux-saga/effects'
import axios from 'axios'
// import { notification } from 'antd'
import actions from './actions'
import { dummyFetchRequest } from '../../utils/helper'
import config from '../../utils/config'
// import { getHeader } from '../../utils/master'
// import { notifConfig } from '../../utils/helper'
// import vars from '../../utils/variable'
import { DATA, DATA_LAYANAN } from './data.json'

function GET_API_DATA() {
  // return axios.get(config.API_DASHBOARD, { headers: getHeader() }).then(res => res.data)

  return dummyFetchRequest(DATA, 600)
}

function GET_API_DATA_LAYANAN_MASYARAKAT() {
  // return axios.get(config.API_DASHBOARD, { headers: getHeader() }).then(res => res.data)

  return dummyFetchRequest(DATA_LAYANAN, 600)
}

async function GET_API_PROVINCE_LIST() {
  const response = await axios.get(config.API_PROVINCE)

  return {
    acknowledge: 1,
    message: 'TRUE',
    data: response.data,
  }
}

async function GET_API_CITY_LIST({ id }) {
  const response = await axios.get(`${config.API_CITY}/${id}.json`)

  return {
    acknowledge: 1,
    message: 'TRUE',
    data: response.data,
  }
}

export function* GET_DATA_LIST() {
  try {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: true,
      },
    })
    const result = yield call(GET_API_DATA)
    const { message, acknowledge, data } = result
    if (acknowledge === 1) {
      console.log(message)
      yield put({
        type: actions.SET_STATE,
        payload: {
          membershipData: data.detail,
          error: false,
        },
      })
    } else {
      yield put({
        type: actions.SET_STATE,
        payload: {
          error: true,
        },
      })
    }
  } catch (e) {
    console.log(e)
    yield put({
      type: actions.SET_STATE,
      payload: {
        error: true,
      },
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

export function* GET_DATA_DETAIL({ payload }) {
  try {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loadingDetail: true,
      },
    })
    const result = yield call(GET_API_DATA)
    const { /* message, */ acknowledge, data } = result
    if (acknowledge === 1) {
      // console.log(data, message)
      const findPerson = data.detail.find(el => el.ID === payload.ID)

      yield put({
        type: actions.SET_STATE,
        payload: {
          membershipDetail: findPerson,
          error: false,
        },
      })
    } else {
      yield put({
        type: actions.SET_STATE,
        payload: {
          error: true,
        },
      })
    }
  } catch (e) {
    console.log(e)
    yield put({
      type: actions.SET_STATE,
      payload: {
        error: true,
      },
    })
  } finally {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loadingDetail: false,
      },
    })
  }
}

export function* GET_DATA_PROVINCE_LIST() {
  try {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loadingProvince: true,
      },
    })
    const result = yield call(GET_API_PROVINCE_LIST)
    const { message, acknowledge, data } = result
    console.log(result)
    if (acknowledge === 1) {
      console.log(message)
      console.log(data)
      yield put({
        type: actions.SET_STATE,
        payload: {
          province: data,
          error: false,
        },
      })
    } else {
      yield put({
        type: actions.SET_STATE,
        payload: {
          error: true,
        },
      })
    }
  } catch (e) {
    console.log(e)
    yield put({
      type: actions.SET_STATE,
      payload: {
        error: true,
      },
    })
  } finally {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loadingProvince: false,
      },
    })
  }
}
export function* GET_DATA_CITY_LIST({ payload }) {
  try {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loadingCity: true,
      },
    })
    const result = yield call(GET_API_CITY_LIST, payload)
    const { acknowledge, data } = result
    if (acknowledge === 1) {
      yield put({
        type: actions.SET_STATE,
        payload: {
          city: data,
          error: false,
        },
      })
    } else {
      yield put({
        type: actions.SET_STATE,
        payload: {
          error: true,
        },
      })
    }
  } catch (e) {
    console.log(e)
    yield put({
      type: actions.SET_STATE,
      payload: {
        error: true,
      },
    })
  } finally {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loadingCity: false,
      },
    })
  }
}

export function* GET_DATA_LAYANAN_MASYARAKAT_LIST() {
  try {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loadingLayananMasyarakat: true,
      },
    })
    const result = yield call(GET_API_DATA_LAYANAN_MASYARAKAT)
    const { message, acknowledge, data } = result
    if (acknowledge === 1) {
      console.log(message)
      yield put({
        type: actions.SET_STATE,
        payload: {
          layananMasyarakatList: data.detail,
          error: false,
        },
      })
    } else {
      yield put({
        type: actions.SET_STATE,
        payload: {
          error: true,
        },
      })
    }
  } catch (e) {
    console.log(e)
    yield put({
      type: actions.SET_STATE,
      payload: {
        error: true,
      },
    })
  } finally {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loadingLayananMasyarakat: false,
      },
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_DATA_LIST, GET_DATA_LIST),
    takeEvery(actions.GET_DATA_DETAIL, GET_DATA_DETAIL),
    takeEvery(actions.GET_DATA_PROVINCE_LIST, GET_DATA_PROVINCE_LIST),
    takeEvery(actions.GET_DATA_CITY_LIST, GET_DATA_CITY_LIST),
    takeEvery(actions.GET_DATA_LAYANAN_MASYARAKAT_LIST, GET_DATA_LAYANAN_MASYARAKAT_LIST),
  ])
}
