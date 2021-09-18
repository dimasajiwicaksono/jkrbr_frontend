import { all, put, call, takeEvery } from 'redux-saga/effects'
import axios from 'axios'
import { notification } from 'antd'
import config from '../../../utils/config'
import vars from '../../../utils/variable'
import { getHeader } from '../../../utils/master'
import { notifConfig } from '../../../utils/helper'
import actions from './actions'

function GET_API_BRAND(payload) {
  return axios
    .post(config.API_MST_BRAND_LIST, payload, { headers: getHeader() })
    .then(res => res.data)
}

function GET_API_OUTLET(payload) {
  return axios
    .post(config.API_MST_OUTLET_LIST, payload, { headers: getHeader() })
    .then(res => res.data)
}
//
// function GET_API_LOCATION(payload) {
//   return axios
//     .post(config.API_MST_LOCATION_LIST, payload, { headers: getHeader() })
//     .then(res => res.data)
// }
//
function GET_API_CATEGORY(payload) {
  return axios
    .post(config.API_MST_CATEGORY_ITEM_LIST, payload, { headers: getHeader() })
    .then(res => res.data)
}
//
function GET_API_GROUP(payload) {
  return axios
    .post(config.API_MST_GROUP_ITEM_LIST, payload, { headers: getHeader() })
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

export function* GET_BRAND_OPTION({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingBrand: true,
    },
  })
  try {
    const result = yield call(GET_API_BRAND, payload)
    const { acknowledge, data, message } = result
    if (acknowledge === 1) {
      if (data.length > 0) {
        const firstData = data[0].brandCode
        const lastData = data[data.length - 1].brandCode

        localStorage.setItem('f_brn_cde', firstData)
        localStorage.setItem('l_brn_cde', lastData)
      }

      const optBrand = data.map(el => ({
        title: `${el.brandName}`,
        value: `${el.brandCode}`,
      }))
      yield put({
        type: actions.SET_STATE,
        payload: {
          loadingBrand: false,
          brandOption: optBrand,
        },
      })
    } else {
      notification.error({
        message: 'Failed Brand',
        description: message,
        ...notifConfig,
      })
    }
  } catch (e) {
    console.log(e.message)
    notification.error({
      message: 'Failed Brand Option',
      description: vars.RTO,
      ...notifConfig,
    })
  } finally {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loadingBrand: false,
      },
    })
  }
}

export function* GET_OUTLET_OPTION({ payload }) {
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
      const firstData = data[0]
      const lastData = data[data.length - 1]

      localStorage.setItem('f_otl_cde', firstData.outletCode)
      localStorage.setItem('l_otl_cde', lastData.outletCode)

      const outletOption = data.map(el => ({
        title: `${el.outletName}`,
        value: `${el.outletCode}`,
      }))
      yield put({
        type: actions.SET_STATE,
        payload: {
          loadingOutlet: false,
          outletOption,
        },
      })
    } else {
      notification.error({
        message: 'Failed Outlet',
        description: message,
        ...notifConfig,
      })
    }
  } catch (e) {
    console.log(e.message)
    notification.error({
      message: 'Failed Outlet Option',
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
// export function* GET_LOCATION_OPTION({ payload }) {
//   yield put({
//     type: actions.SET_STATE,
//     payload: {
//       loadingLocation: true,
//     },
//   })
//   try {
//     const result = yield call(GET_API_LOCATION, payload)
//     const { acknowledge, data, message} = result
//     if (acknowledge === 1) {
//       const firstData = data[0]
//       const lastData = data[data.length - 1]
//
//       localStorage.setItem('f_loc_cde', firstData.locaCode)
//       localStorage.setItem('l_loc_cde', lastData.locaCode)
//
//       const locationOption = data.map(el => ({
//         title:`${el.locaName}`,
//         value:`${el.locaCode}`
//       }))
//       yield put({
//         type: actions.SET_STATE,
//         payload: {
//           loadingLocation: false,
//           locationOption
//         },
//       })
//     } else {
//       notification.error({
//         message: 'Failed Location',
//         description: message,
//         ...notifConfig,
//       })
//     }
//   } catch (e) {
//     console.log(e.message)
//     notification.error({
//       message: 'Failed Location Option',
//       description: vars.RTO,
//       ...notifConfig,
//     })
//   } finally {
//     yield put({
//       type: actions.SET_STATE,
//       payload: {
//         loadingLocation: false,
//       },
//     })
//   }
// }

export function* GET_GROUP_OPTION({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingGroup: true,
    },
  })
  try {
    const result = yield call(GET_API_GROUP, payload)
    const { acknowledge, data, message } = result
    if (acknowledge === 1) {
      const firstData = data[0]
      const lastData = data[data.length - 1]

      localStorage.setItem('f_grp_cde', firstData.groupCode)
      localStorage.setItem('l_grp_cde', lastData.groupCode)

      const groupOption = data.map(el => ({
        title: `${el.groupName}`,
        value: `${el.groupCode}`,
      }))
      yield put({
        type: actions.SET_STATE,
        payload: {
          loadingGroup: false,
          groupOption,
        },
      })
    } else {
      notification.error({
        message: 'Failed Group',
        description: message,
        ...notifConfig,
      })
    }
  } catch (e) {
    console.log(e.message)
    notification.error({
      message: 'Failed Group Option',
      description: vars.RTO,
      ...notifConfig,
    })
  } finally {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loadingGroup: false,
      },
    })
  }
}
export function* GET_CATEGORY_OPTION({ payload }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      loadingCategory: true,
    },
  })
  try {
    const result = yield call(GET_API_CATEGORY, payload)
    const { acknowledge, data, message } = result
    if (acknowledge === 1) {
      const firstData = data[0]
      const lastData = data[data.length - 1]

      localStorage.setItem('f_ctg_cde', firstData.cateCode)
      localStorage.setItem('l_ctg_cde', lastData.cateCode)
      const categoryOption = data.map(el => ({
        title: `${el.cateName}`,
        value: `${el.cateCode}`,
      }))
      yield put({
        type: actions.SET_STATE,
        payload: {
          loadingCategory: false,
          categoryOption,
        },
      })
    } else {
      notification.error({
        message: 'Failed Category',
        description: message,
        ...notifConfig,
      })
    }
  } catch (e) {
    console.log(e.message)
    notification.error({
      message: 'Failed Category Option',
      description: vars.RTO,
      ...notifConfig,
    })
  } finally {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loadingCategory: false,
      },
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.HANDLE_STATE, HANDLE_STATE),
    takeEvery(actions.GET_BRAND_OPTION, GET_BRAND_OPTION),
    takeEvery(actions.GET_OUTLET_OPTION, GET_OUTLET_OPTION),
    // takeEvery(actions.GET_LOCATION_OPTION, GET_LOCATION_OPTION),
    takeEvery(actions.GET_GROUP_OPTION, GET_GROUP_OPTION),
    takeEvery(actions.GET_CATEGORY_OPTION, GET_CATEGORY_OPTION),
  ])
}
