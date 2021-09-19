import { all, put, call, takeEvery } from 'redux-saga/effects'
import axios from 'axios'
import { Modal } from 'antd'
import actions from './actions'
import { dummyFetchRequest } from '../../utils/helper'
import { DATA, DATA_LAYANAN } from './data.json'
import config from '../../utils/config'

function GET_API_DATA() {
  // return axios.get(config.API_DASHBOARD, { headers: getHeader() }).then(res => res.data)

  return dummyFetchRequest(DATA, 600)
}

function GET_API_DATA_LAYANAN_MASYARAKAT() {
  // return axios.get(config.API_DASHBOARD, { headers: getHeader() }).then(res => res.data)

  return dummyFetchRequest(DATA_LAYANAN, 600)
}

function ADD_API_KASUS_NARKOBA(payload) {
  return axios.post(config.API_KASUS_NARKOBA_SAVE, payload).then(res => res.data)
// console.log(payload)
//
//   const res = {
//   acknowledge: 1,
//     message: 'TT'
//   }
//
//   return dummyFetchRequest(res, 600)
}

async function GET_API_PROVINCE_LIST(token) {
  const response = await axios.get(`https://x.rajaapi.com/MeP7c5ne${token}/m/wilayah/provinsi`)

  return {
    acknowledge: 1,
    message: 'TRUE',
    data: response.data.code === 200 ? response.data.data : []
  }
}

async function GET_API_CITY_LIST({token, id}) {
  const response = await axios.get(`https://x.rajaapi.com/MeP7c5ne${token}/m/wilayah/kabupaten?idpropinsi=${id}`)


  return {
    acknowledge: 1,
    message: 'TRUE',
    data:  response.data.code === 200 ? response.data.data : []
  }
}

async function GET_API_KECAMATAN_LIST({ token, id }) {
  const response = await axios.get(`https://x.rajaapi.com/MeP7c5ne${token}/m/wilayah/kecamatan?idkabupaten=${id}`)


  return {
    acknowledge: 1,
    message: 'TRUE',
    data:  response.data.code === 200 ? response.data.data : []
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

export function* GET_DATA_PROVINCE_LIST({token}) {
  try {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loadingProvince: true,
      },
    })
    const result = yield call(GET_API_PROVINCE_LIST, token)
    const { message, acknowledge, data } = result
    console.log("result", result)
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
export function* GET_DATA_KECAMATAN_LIST({ payload }) {
  try {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loadingKecamatan: true,
      },
    })
    const result = yield call(GET_API_KECAMATAN_LIST, payload)
    const { acknowledge, data } = result
    if (acknowledge === 1) {
      yield put({
        type: actions.SET_STATE,
        payload: {
          district: data,
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
        loadingKecamatan: false,
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

export function* ADD_KASUS_NARKOBA({payload}) {
  try {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: true,
      },
    })
    const result = yield call(ADD_API_KASUS_NARKOBA, payload)
    const { message, acknowledge } = result
    if (acknowledge === 1) {
      console.log(message)
      yield put({
        type: actions.SET_STATE,
        payload: {
          error: false,
          loading: false
        },
      })

      Modal.success({
        content: 'SUSKES CRETATE'
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

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_DATA_LIST, GET_DATA_LIST),
    takeEvery(actions.GET_DATA_DETAIL, GET_DATA_DETAIL),
    takeEvery(actions.GET_DATA_PROVINCE_LIST, GET_DATA_PROVINCE_LIST),
    takeEvery(actions.GET_DATA_CITY_LIST, GET_DATA_CITY_LIST),
    takeEvery(actions.GET_DATA_KECAMATAN_LIST, GET_DATA_KECAMATAN_LIST),
    takeEvery(actions.GET_DATA_LAYANAN_MASYARAKAT_LIST, GET_DATA_LAYANAN_MASYARAKAT_LIST),

    takeEvery(actions.ADD_KASUS_NARKOBA, ADD_KASUS_NARKOBA),
  ])
}
