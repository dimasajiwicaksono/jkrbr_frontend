import { all, put, call, takeEvery } from 'redux-saga/effects'
import axios from 'axios'
import { notification } from 'antd'
import config from '../../../utils/config'
import { getHeader } from '../../../utils/master'
import vars from '../../../utils/variable'
import { notifConfig } from '../../../utils/helper'

function GET_API_LIST(payload) {
  return axios
    .post(config.API_SET_INV_OPENING_BLC_COA_LIST, payload, { headers: getHeader() })
    .then(res => res.data)
}

function GET_API_SAVE(payload) {
  return axios
    .post(config.API_SET_INV_OPENING_BLC_COA_SAVE, payload, { headers: getHeader() })
    .then(res => res.data)
}

export function* HANDLE_STATE({ field, value }) {
  yield put({
    type: 'setInvOpeningCOA/SET_STATE',
    payload: {
      [field]: value,
    },
  })
}

export function* GET_DATA_INV_OPENING_COA_LIST({ payload }) {
  yield put({
    type: 'setInvOpeningCOA/SET_STATE',
    payload: {
      loading: true,
    },
  })
  try {
    const result = yield call(GET_API_LIST, payload)
    const { acknowledge, data, message } = result
    if (acknowledge === 1) {
      yield put({
        type: 'setInvOpeningCOA/SET_STATE',
        payload: {
          setInvOpeningCOAData: data,
        },
      })
    } else {
      notification.error({
        message: vars.FLD_SALES_INV_OPENING_COA,
        description: message,
        ...notifConfig,
      })
    }
  } catch (e) {
    notification.error({
      message: vars.FLD_SALES_INV_OPENING_COA,
      description: vars.RTO,
      ...notifConfig,
    })
  } finally {
    yield put({
      type: 'setInvOpeningCOA/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export function* GET_DATA_INV_OPENING_COA_SAVE({ payload }) {
  yield put({
    type: 'setInvOpeningCOA/SET_STATE',
    payload: {
      loadingDetail: true,
      loadingProcess: true,
    },
  })
  try {
    const result = yield call(GET_API_SAVE, payload)
    const { acknowledge, message } = result
    if (acknowledge === 1) {
      yield put({
        type: 'setInvOpeningCOA/SET_STATE',
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
      type: 'setInvOpeningCOA/SET_STATE',
      payload: {
        loadingDetail: false,
        loadingProcess: false,
      },
    })
  }
}

function* HANDLE_CONTENT({ payload }) {
  yield put({
    type: 'setInvOpeningCOA/SET_STATE',
    payload: {
      contentStatus: payload,
    },
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery('setInvOpeningCOA/HANDLE_STATE', HANDLE_STATE),
    takeEvery('setInvOpeningCOA/GET_DATA_INV_OPENING_COA_LIST', GET_DATA_INV_OPENING_COA_LIST),
    takeEvery('setInvOpeningCOA/GET_DATA_INV_OPENING_COA_SAVE', GET_DATA_INV_OPENING_COA_SAVE),
    takeEvery('setInvOpeningCOA/HANDLE_CONTENT', HANDLE_CONTENT),
  ])
}
