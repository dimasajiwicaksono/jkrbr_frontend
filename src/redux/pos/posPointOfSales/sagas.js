import { all, put, call, takeEvery } from 'redux-saga/effects'
import axios from 'axios'
import { notification } from 'antd'
import _ from 'lodash'
import config from '../../../utils/config'
import { getHeader } from '../../../utils/master'
import vars from '../../../utils/variable'
import { notifConfig } from '../../../utils/helper'
import actions from './actions'

function GET_API_LIST() {
  return axios.get(config.API_POS_POINT_OF_SLS_LIST, { headers: getHeader() }).then(res => res.data)
}

function GET_API_DETAIL(payload) {
  return axios
    .post(config.API_POS_POINT_OF_SLS_DETAIL, payload, { headers: getHeader() })
    .then(res => res.data)
}

function GET_API_SAVE(payload) {
  return axios
    .post(config.API_POS_POINT_OF_SLS_SAVE, payload, { headers: getHeader() })
    .then(res => res.data)
}

function GET_API_UPDATE(payload) {
  return axios
    .post(config.API_POS_POINT_OF_SLS_UPDATE, payload, { headers: getHeader() })
    .then(res => res.data)
}

// function GET_API_DELETE(payload) {
//   return axios
//     .post(config.API_POS_POINT_OF_SLS_DELETE, payload, { headers: getHeader() })
//     .then(res => res.data)
// }

function GET_API_PDF() {
  return axios.get(config.API_POS_POINT_OF_SLS_PDF, { headers: getHeader() }).then(res => res.data)
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

export function* GET_DATA_POS_LIST({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
    },
  })
  try {
    const result = yield call(GET_API_LIST, payload)
    const { acknowledge, data, message } = result
    if (acknowledge === 1) {
      yield put({
        type: actions.SET_STATE,
        payload: {
          posPointOfSalesData: {
            data,
          },
        },
      })
    } else {
      notification.error({
        message: vars.FLD_POS_POINT_OF_SALES,
        description: message,
        ...notifConfig,
      })
      console.log(message)
    }
  } catch (e) {
    console.log(e)
    notification.error({
      message: vars.FLD_POS_POINT_OF_SALES,
      description: vars.RTO,
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

export function* GET_DATA_POS_SAVE({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loading: true,
      loadingProcess: true,
    },
  })
  try {
    const result = yield call(GET_API_SAVE, payload)
    const { acknowledge, message } = result
    if (acknowledge) {
      notification.success({
        message: vars.SUCCESS,
        description: message,
        ...notifConfig,
      })

      yield put({
        type: actions.SET_STATE,
        payload: {
          contentStatus: 'isView',
        },
      })
    } else {
      notification.error({
        message: vars.FLD_POS_POINT_OF_SALES,
        description: message,
        ...notifConfig,
      })
      console.log(message)
    }
  } catch (e) {
    console.log(e)
    notification.error({
      message: vars.FLD_POS_POINT_OF_SALES,
      description: vars.RTO,
      ...notifConfig,
    })
  } finally {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: false,
        loadingProcess: false,
      },
    })
  }
}

export function* GET_DATA_POS_DETAIL({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingDetail: true,
    },
  })
  try {
    const result = yield call(GET_API_DETAIL, payload)
    const { acknowledge, data, message } = result
    if (acknowledge === 1) {
      // const { header, detail } = data
      const list = []
      data.map(val =>
        list.push({
          menuCode: val.menuCode,
          menuName: val.menuName,
          qty: val.qty,
          unitPrice: val.unitPrice,
          amount: val.amount,
          discount: val.discount,
          service: val.service,
        }),
      )
      yield put({
        type: actions.SET_STATE,
        payload: {
          posPointOfSalesDetail: {
            loading: false,
            acknowledge,
            data: list,
            message,
          },
        },
      })
    } else {
      notification.error({
        message: vars.FLD_POS_POINT_OF_SALES,
        description: message,
        ...notifConfig,
      })
    }
  } catch (e) {
    console.log(e)
    notification.error({
      message: vars.FLD_POS_POINT_OF_SALES,
      description: vars.RTO,
      ...notifConfig,
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

export function* GET_DATA_POS_UPDATE({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingDetail: true,
      loadingProcess: true,
    },
  })
  try {
    const result = yield call(GET_API_UPDATE, payload)
    const { acknowledge, message } = result
    if (acknowledge === 1) {
      yield put({
        type: actions.SET_STATE,
        payload: {
          contentStatus: 'isView',
        },
      })
      notification.success({
        message: vars.SUCCESS,
        description: message,
        ...notifConfig,
      })
    } else {
      notification.error({
        message: vars.ERROR,
        description: message,
        ...notifConfig,
      })
    }
  } catch (e) {
    console.log(e)
    notification.error({
      message: vars.ERROR,
      description: vars.RTO,
      ...notifConfig,
    })
  } finally {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loadingDetail: false,
        loadingProcess: false,
      },
    })
  }
}

// export function* GET_DATA_POS_DELETE({ payload }) {
//   yield put({
//     type: actions.SET_STATE,
//     payload: {
//       loadingDetail: true,
//     },
//   })
//   try {
//     const result = yield call(GET_API_DELETE, payload)
//     const { acknowledge, message } = result
//     if (acknowledge === 1) {
//       notification.success({
//         message: vars.SUCCESS,
//         description: message,
//         ...notifConfig,
//       })
//     } else {
//       notification.error({
//         message: vars.ERROR,
//         description: message,
//         ...notifConfig,
//       })
//     }
//   } catch (e) {
//     console.log(e)
//     notification.error({
//       message: vars.ERROR,
//       description: vars.RTO,
//       ...notifConfig,
//     })
//   } finally {
//     yield put({
//       type: actions.SET_STATE,
//       payload: {
//         loadingDetail: false,
//       },
//     })
//   }
// }

export function* GET_DATA_POS_PDF() {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingDetail: true,
    },
  })
  try {
    const result = yield call(GET_API_PDF)
    const { acknowledge, message } = result
    if (acknowledge === 1) {
      notification.success({
        message: vars.SUCCESS,
        description: message,
        ...notifConfig,
      })
    } else {
      notification.error({
        message: vars.ERROR,
        description: message,
        ...notifConfig,
      })
    }
  } catch (e) {
    console.log(e)
    notification.error({
      message: vars.ERROR,
      description: vars.RTO,
      ...notifConfig,
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

export function* HANDLE_CONTENT({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      contentStatus: payload,
    },
  })
}

export function* GET_DATA_OUTLET({ payload }) {
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
      const decode = JSON.parse(atob(localStorage.getItem('token').split('.')[1]))
      const mapOutlet = decode.outletCode.map(el => ({
        outletCode: el,
      }))

      const outletData = data.map(el => ({
        outletCode: el.outletCode,
        outletName: el.outletName,
      }))

      // INNER JOIN KETIKA ADA OUTLET YANG SAMA
      const outletAccess = _.intersectionBy(outletData, mapOutlet, 'outletCode')

      yield put({
        type: actions.SET_STATE,
        payload: {
          outletAccess,
          outletData,
        },
      })
    } else {
      notification.error({
        message: 'ERROR',
        description: message,
        ...notifConfig,
      })
      console.log(message)
    }
  } catch (e) {
    console.log(e)
    notification.error({
      message: 'ERROR',
      description: vars.RTO,
      ...notifConfig,
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

export default function* rootSaga() {
  yield all([
    takeEvery(actions.HANDLE_STATE, HANDLE_STATE),
    takeEvery(actions.GET_DATA_POS_LIST, GET_DATA_POS_LIST),
    takeEvery(actions.GET_DATA_POS_DETAIL, GET_DATA_POS_DETAIL),
    takeEvery(actions.GET_DATA_POS_SAVE, GET_DATA_POS_SAVE),
    takeEvery(actions.GET_DATA_POS_UPDATE, GET_DATA_POS_UPDATE),
    takeEvery(actions.GET_DATA_POS_PDF, GET_DATA_POS_PDF),
    takeEvery(actions.HANDLE_CONTENT, HANDLE_CONTENT),
    takeEvery(actions.GET_DATA_OUTLET, GET_DATA_OUTLET),
    // takeEvery(actions.GET_DATA_POS_DELETE, GET_DATA_POS_DELETE),
    // takeEvery('posPointOfSales/GET_DATA_POS_DATA_SALES_SAVE', POS_UPLOAD_FILE_CSV),
    // takeEvery('posPointOfSales/GET_DATA_PURCHASE_REQUEST_SAVE', GET_DATA_PURCHASE_REQUEST_SAVE),
  ])
}
