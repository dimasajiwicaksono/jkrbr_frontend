import { all, put, call, takeEvery } from 'redux-saga/effects'
import axios from 'axios'
import { notification } from 'antd'
import config from '../../../utils/config'
import { getHeader } from '../../../utils/master'
import vars from '../../../utils/variable'
import actions from './actions'

function GET_API_MST_CUSTOMER_OPTION(payload) {
  return axios
    .post(config.API_MST_CUSTOMER_LIST, payload, { headers: getHeader() })
    .then(res => res.data)
}

function GET_API_MST_ITEM_OPTION(payload) {
  return axios
    .post(config.API_MST_ITEMS_LIST, payload, { headers: getHeader() })
    .then(res => res.data)
}

function GET_API_TENDER_MEDIA_OPTION(payload) {
  return axios
    .post(config.API_POS_TENDER_MEDIA_LIST, payload, { headers: getHeader() })
    .then(res => res.data)
}

function ADD_API_POS(payload) {
  return axios
    .post(config.API_POS_POINT_OF_SLS_SAVE, payload, { headers: getHeader() })
    .then(res => res.data)
}

function GET_API_OUTLET(payload) {
  return axios
    .post(config.API_MST_OUTLET_LIST, payload, { headers: getHeader() })
    .then(res => res.data)
}

export function* HANDLE_STATE({ field, value }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      [field]: value,
    },
  })
}

export function* GET_MST_CUSTOMER_OPTION({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingOption: true,
    },
  })
  try {
    const result = yield call(GET_API_MST_CUSTOMER_OPTION, payload)
    const { acknowledge, data, message } = result
    if (acknowledge === 1) {
      yield put({
        type: actions.SET_STATE,
        payload: {
          optCustomer: (data || []).map(el => ({
            title: `${el.custCode} | ${el.custName}`,
            value: el.custCode,
          })),
        },
      })
    } else {
      notification.error({
        message: 'ERROR',
        description: message,
      })
    }
  } catch (e) {
    console.log(e.message)
    notification.error({
      message: 'ERROR',
      description: vars.RTO,
    })
  } finally {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loadingOption: false,
      },
    })
  }
}

export function* GET_MST_ITEM_OPTION({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingItem: true,
    },
  })
  try {
    const result =
      JSON.parse(localStorage.getItem('itemMaster')) === null
        ? yield call(GET_API_MST_ITEM_OPTION, payload)
        : {
            acknowledge: 1,
            data: JSON.parse(localStorage.getItem('itemMaster')),
            message: 'success',
          }

    const { acknowledge, data, message } = result
    if (acknowledge === 1) {
      const str = JSON.stringify(data)
      localStorage.setItem('itemMaster', str)
      yield put({
        type: actions.SET_STATE,
        payload: {
          loadingItem: false,
          dataItem: {
            data,
          },
        },
      })
      notification.success({
        message: 'SUCCESS',
        description: 'Items Updated',
      })
    } else {
      notification.error({
        message: 'ERROR',
        description: message,
      })
    }
  } catch (e) {
    console.log(e.message)
    notification.error({
      message: 'ERROR',
      description: vars.RTO,
    })
  } finally {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loadingItem: false,
      },
    })
  }
}

export function* HANDLE_SAVE({ payload, isSuccess }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingSave: true,
    },
  })
  try {
    const result = yield call(ADD_API_POS, payload)
    const { acknowledge, message } = result
    if (acknowledge === 1) {
      yield put({
        type: actions.SET_STATE,
        payload: {
          isSuccess,
        },
      })
      notification.success({
        message: 'SUKSES',
        description: message,
      })
    } else {
      notification.error({
        message: 'ERROR',
        description: message,
      })
    }
  } catch (e) {
    console.log(e.message)
    notification.error({
      message: 'ERROR',
      description: vars.RTO,
    })
  } finally {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loadingSave: false,
        isSuccess: false,
      },
    })
  }
}

export function* HANDLE_CONTENT({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      contentStatus: payload,
    },
  })
}

export function* GET_TENDER_MEDIA_OPTION({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingTenderMedia: true,
    },
  })
  try {
    const result = yield call(GET_API_TENDER_MEDIA_OPTION, payload)
    const { acknowledge, data, message } = result
    if (acknowledge === 1) {
      const tenderMediaData = data.map(el => ({
        tenderName: (el.TenderName || '').trim(),
        settleCode: (el.SettleCode || '').trim(),
        paidType: el.PaidType,
        outletCode: (el.OutletCode || '').trim(),
      }))

      const optTenderMedia = tenderMediaData.map((el, idx) => ({
        title: `${el.settleCode} | ${el.tenderName}`,
        value: `${el.settleCode} | ${el.tenderName} | ${el.paidType} | ${idx}`,
      }))

      yield put({
        type: actions.SET_STATE,
        payload: {
          optTenderMedia,
        },
      })
    } else {
      notification.error({
        message: 'ERROR',
        description: message,
      })
    }
  } catch (e) {
    console.log(e.message)
    notification.error({
      message: 'ERROR',
      description: vars.RTO,
    })
  } finally {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loadingTenderMedia: false,
      },
    })
  }
}

export function* GET_OUTLET_OPTION({ payload, outletCode }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingOutlet: true,
    },
  })
  try {
    const result = yield call(GET_API_OUTLET, payload)
    const { acknowledge, data, message } = result
    if (acknowledge === 1) {
      const optOutlet = data.map(el => ({
        title: el.outletName,
        value: el.outletCode,
      }))

      const outletAccess = optOutlet.filter(el => el.value === outletCode)

      const isCheck = outletAccess.length === 1
      const selectedOutlet = isCheck ? `${outletCode} | ${outletAccess[0].title}` : ''

      const billNo = `${outletCode}-201208-0001`
      yield put({
        type: actions.SET_STATE,
        payload: {
          optOutlet,
          selectedOutlet,
          billNo,
          outletCode,
        },
      })
    } else {
      notification.error({
        message: 'ERROR',
        description: message,
      })
    }
  } catch (e) {
    console.log(e.message)
    notification.error({
      message: 'ERROR',
      description: vars.RTO,
    })
  } finally {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loadingOutlet: false,
      },
    })
  }
}

export function* HANDLE_OUTLET({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
    },
  })
  try {
    const { outletCode } = payload
    yield put({
      type: actions.SET_STATE,
      payload: {
        outletSelected: outletCode,
      },
    })

    yield put({
      type: actions.GET_TENDER_MEDIA_OPTION,
      payload: {
        outletCode,
        tenderName: '',
        settleCode: '',
      },
    })

    yield put({
      type: actions.GET_MST_CUSTOMER_OPTION,
      payload: {},
    })

    yield put({
      type: actions.GET_MST_ITEM_OPTION,
      payload: {},
    })

    yield put({
      type: actions.GET_OUTLET_OPTION,
      payload: {},
      outletCode,
    })
  } catch (e) {
    console.log(e.message)
    notification.error({
      message: 'ERROR',
      description: vars.RTO,
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
    takeEvery(actions.HANDLE_STATE, HANDLE_STATE),
    takeEvery(actions.HANDLE_CONTENT, HANDLE_CONTENT),
    takeEvery(actions.GET_MST_CUSTOMER_OPTION, GET_MST_CUSTOMER_OPTION),
    takeEvery(actions.GET_MST_ITEM_OPTION, GET_MST_ITEM_OPTION),
    takeEvery(actions.GET_TENDER_MEDIA_OPTION, GET_TENDER_MEDIA_OPTION),
    takeEvery(actions.GET_OUTLET_OPTION, GET_OUTLET_OPTION),
    takeEvery(actions.HANDLE_SAVE, HANDLE_SAVE),
    takeEvery(actions.HANDLE_OUTLET, HANDLE_OUTLET),
  ])
}
