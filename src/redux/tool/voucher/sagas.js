import { all, put, call, takeEvery } from 'redux-saga/effects'
import axios from 'axios'
import { notification } from 'antd'
import config from '../../../utils/config'
import { getHeader } from '../../../utils/master'
import vars from '../../../utils/variable'

function GET_API_LIST(payload) {
  return axios
    .post(config.API_TOOL_VOUCHER_LIST, payload, { headers: getHeader() })
    .then(res => res.data)
}

function GET_API_SAVE(payload) {
  return axios
    .post(config.API_TOOL_VOUCHER_SAVE, payload, { headers: getHeader() })
    .then(res => res.data)
}

function GET_API_UPDATE(payload) {
  return axios
    .post(config.API_TOOL_VOUCHER_UPDATE, payload, { headers: getHeader() })
    .then(res => res.data)
}

function GET_API_DELETE(payload) {
  return axios
    .post(config.API_TOOL_VOUCHER_DELETE, payload, { headers: getHeader() })
    .then(res => res.data)
}

export function* HANDLE_STATE({ field, value }) {
  yield put({
    type: 'toolVoucher/SET_STATE',
    payload: {
      [field]: value,
    },
  })
}

export function* GET_DATA_TOOL_VOUCHER_LIST({ payload }) {
  yield put({
    type: 'toolVoucher/SET_STATE',
    payload: {
      loading: true,
    },
  })
  try {
    const result = yield call(GET_API_LIST, payload)
    const { acknowledge, data, message } = result
    if (acknowledge === 1) {
      yield put({
        type: 'toolVoucher/SET_STATE',
        payload: {
          toolVoucherData: {
            acknowledge,
            data,
            message,
          },
        },
      })
    } else {
      notification.error({
        message: vars.FLD_GROUP,
        description: message,
      })
    }
  } catch (e) {
    console.log(e.message)
    notification.error({
      message: vars.FLD_GROUP,
      description: vars.RTO,
    })
  } finally {
    yield put({
      type: 'toolVoucher/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export function* GET_DATA_TOOL_VOUCHER_SAVE({ payload }) {
  yield put({
    type: 'toolVoucher/SET_STATE',
    payload: {
      loadingDetail: true,
      toolVoucherSelectedRow: '',
      loadingProcess: true,
    },
  })
  try {
    const result = yield call(GET_API_SAVE, payload)
    const { acknowledge, message } = result
    if (acknowledge === 1) {
      yield put({
        type: 'toolVoucher/SET_STATE',
        payload: {
          contentStatus: 'isView',
        },
      })
      notification.success({
        message: vars.SUCCESS,
        description: message,
      })
    } else {
      notification.error({
        message: vars.ERROR,
        description: message,
      })
    }
  } catch (e) {
    console.log(e)
    notification.error({
      message: vars.ERROR,
      description: vars.RTO,
    })
  } finally {
    yield put({
      type: 'toolVoucher/SET_STATE',
      payload: {
        loadingDetail: false,
        loadingProcess: false,
      },
    })
  }
}

export function* GET_DATA_TOOL_VOUCHER_UPDATE({ payload }) {
  yield put({
    type: 'toolVoucher/SET_STATE',
    payload: {
      loadingDetail: true,
      toolVoucherSelectedRow: '',
      loadingProcess: true,
    },
  })
  try {
    const result = yield call(GET_API_UPDATE, payload)
    const { acknowledge, message } = result
    if (acknowledge === 1) {
      yield put({
        type: 'toolVoucher/SET_STATE',
        payload: {
          contentStatus: 'isView',
        },
      })
      notification.success({
        message: vars.SUCCESS,
        description: message,
      })
    } else {
      notification.error({
        message: vars.ERROR,
        description: message,
      })
    }
  } catch (e) {
    console.log(e)
    notification.error({
      message: vars.ERROR,
      description: vars.RTO,
    })
  } finally {
    yield put({
      type: 'toolVoucher/SET_STATE',
      payload: {
        loadingDetail: false,
        loadingProcess: false,
      },
    })
  }
}

export function* GET_DATA_TOOL_VOUCHER_DELETE({ payload }) {
  yield put({
    type: 'toolVoucher/SET_STATE',
    payload: {
      loadingDetail: true,
      toolVoucherSelectedRow: '',
    },
  })
  try {
    const result = yield call(GET_API_DELETE, payload)
    const { acknowledge, message } = result
    if (acknowledge === 1) {
      notification.success({
        message: vars.SUCCESS,
        description: message,
      })
    } else {
      notification.error({
        message: vars.ERROR,
        description: message,
      })
    }
  } catch (e) {
    console.log(e)
    notification.error({
      message: vars.ERROR,
      description: vars.RTO,
    })
  } finally {
    yield put({
      type: 'toolVoucher/SET_STATE',
      payload: {
        loadingDetail: false,
      },
    })
  }
}

export function* HANDLE_CONTENT({ payload }) {
  yield put({
    type: 'toolVoucher/SET_STATE',
    payload: {
      contentStatus: payload,
    },
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery('toolVoucher/HANDLE_STATE', HANDLE_STATE),
    takeEvery('toolVoucher/GET_DATA_TOOL_VOUCHER_LIST', GET_DATA_TOOL_VOUCHER_LIST),
    takeEvery('toolVoucher/GET_DATA_TOOL_VOUCHER_SAVE', GET_DATA_TOOL_VOUCHER_SAVE),
    takeEvery('toolVoucher/GET_DATA_TOOL_VOUCHER_UPDATE', GET_DATA_TOOL_VOUCHER_UPDATE),
    takeEvery('toolVoucher/GET_DATA_TOOL_VOUCHER_DELETE', GET_DATA_TOOL_VOUCHER_DELETE),
    takeEvery('toolVoucher/HANDLE_CONTENT', HANDLE_CONTENT),
  ])
}
