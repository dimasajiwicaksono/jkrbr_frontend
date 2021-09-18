import { all, put, call, takeEvery } from 'redux-saga/effects'
import axios from 'axios'
import { notification } from 'antd'
import config from '../../../utils/config'
import { getHeader, getHeaderMultipart } from '../../../utils/master'
import vars from '../../../utils/variable'
import { notifConfig } from '../../../utils/helper'

function GET_API_LIST(payload) {
  return axios
    .post(config.API_SET_INV_OPENING_BLC_LIST, payload, { headers: getHeader() })
    .then(res => res.data)
}

function GET_API_DETAIL(payload) {
  return axios
    .post(config.API_SET_INV_OPENING_BLC_DETAIL, payload, { headers: getHeader() })
    .then(res => res.data)
}

function GET_API_SAVE(payload) {
  return axios
    .post(config.API_SET_INV_OPENING_BLC_SAVE, payload, { headers: getHeader() })
    .then(res => res.data)
}

function GET_API_UPDATE(payload) {
  return axios
    .post(config.API_SET_INV_OPENING_BLC_UPDATE, payload, { headers: getHeader() })
    .then(res => res.data)
}

function GET_API_DELETE(payload) {
  return axios
    .post(config.API_SET_INV_OPENING_BLC_DELETE, payload, { headers: getHeader() })
    .then(res => res.data)
}

function GET_API_APPROVE(payload) {
  return axios
    .post(config.API_SET_INV_OPENING_BLC_APPROVE, payload, { headers: getHeader() })
    .then(res => res.data)
}

function GET_API_UNAPPROVE(payload) {
  return axios
    .post(config.API_SET_INV_OPENING_BLC_UNAPPROVE, payload, { headers: getHeader() })
    .then(res => res.data)
}

function GET_API_IMPORT(payload) {
  const bodyFormData = new FormData()
  bodyFormData.append('sheet', payload.sheet)
  bodyFormData.append('files', payload.files)
  const result = axios
    .post(config.API_SET_INV_OPENING_BLC_UPLOAD, bodyFormData, { headers: getHeaderMultipart() })
    .then(res => res.data)
  return result
}

export function* HANDLE_STATE({ field, value }) {
  yield put({
    type: 'setInvOpeningBalance/SET_STATE',
    payload: {
      [field]: value,
    },
  })
}

export function* GET_DATA_INV_OPENING_BLC_LIST({ payload }) {
  yield put({
    type: 'setInvOpeningBalance/SET_STATE',
    payload: {
      loading: true,
    },
  })
  try {
    const result = yield call(GET_API_LIST, payload)
    const { acknowledge, data, message } = result
    if (acknowledge === 1) {
      yield put({
        type: 'setInvOpeningBalance/SET_STATE',
        payload: {
          setInvOpeningBalanceData: data,
        },
      })
    } else {
      notification.error({
        message: vars.FLD_SALES_INV_OPENING_BLC,
        description: message,
        ...notifConfig,
      })
    }
  } catch (e) {
    notification.error({
      message: vars.FLD_SALES_INV_OPENING_BLC,
      description: vars.RTO,
      ...notifConfig,
    })
  } finally {
    yield put({
      type: 'setInvOpeningBalance/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export function* GET_DATA_INV_OPENING_BLC_DETAIL({ payload }) {
  yield put({
    type: 'setInvOpeningBalance/SET_STATE',
    payload: {
      loadingDetail: true,
    },
  })
  try {
    const result = yield call(GET_API_DETAIL, payload)
    const { acknowledge, data, message } = result
    if (acknowledge === 1) {
      const { header, detail } = data
      yield put({
        type: 'setInvOpeningBalance/SET_STATE',
        payload: {
          setInvOpeningBalanceDetail: {
            acknowledge,
            header,
            data: detail,
          },
        },
      })
    } else {
      notification.error({
        message: vars.FLD_SALES_INV_OPENING_BLC,
        description: message,
        ...notifConfig,
      })
    }
  } catch (e) {
    console.log(e)
    notification.error({
      message: vars.FLD_SALES_INV_OPENING_BLC,
      description: vars.RTO,
      ...notifConfig,
    })
  } finally {
    yield put({
      type: 'setInvOpeningBalance/SET_STATE',
      payload: {
        loadingDetail: false,
      },
    })
  }
}

export function* GET_DATA_INV_OPENING_BLC_SAVE({ payload }) {
  yield put({
    type: 'setInvOpeningBalance/SET_STATE',
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
        type: 'setInvOpeningBalance/SET_STATE',
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
      type: 'setInvOpeningBalance/SET_STATE',
      payload: {
        loadingDetail: false,
        loadingProcess: false,
      },
    })
  }
}

export function* GET_DATA_INV_OPENING_BLC_UPDATE({ payload }) {
  yield put({
    type: 'setInvOpeningBalance/SET_STATE',
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
        type: 'setInvOpeningBalance/SET_STATE',
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
      type: 'setInvOpeningBalance/SET_STATE',
      payload: {
        loadingDetail: false,
        loadingProcess: false,
      },
    })
  }
}

export function* GET_DATA_INV_OPENING_BLC_DELETE({ payload }) {
  yield put({
    type: 'setInvOpeningBalance/SET_STATE',
    payload: {
      loadingDetail: true,
    },
  })
  try {
    const result = yield call(GET_API_DELETE, payload)
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
      type: 'setInvOpeningBalance/SET_STATE',
      payload: {
        loadingDetail: false,
      },
    })
  }
}

export function* GET_DATA_INV_OPENING_BLC_APPROVE({ payload }) {
  yield put({
    type: 'setInvOpeningBalance/SET_STATE',
    payload: {
      loadingDetail: true,
    },
  })
  try {
    const result = yield call(GET_API_APPROVE, payload)
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
      type: 'setInvOpeningBalance/SET_STATE',
      payload: {
        loadingDetail: false,
      },
    })
  }
}

export function* GET_DATA_INV_OPENING_BLC_UNAPPROVE({ payload }) {
  yield put({
    type: 'setInvOpeningBalance/SET_STATE',
    payload: {
      loadingDetail: true,
    },
  })
  try {
    const result = yield call(GET_API_UNAPPROVE, payload)
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
      type: 'setInvOpeningBalance/SET_STATE',
      payload: {
        loadingDetail: false,
      },
    })
  }
}

export function* GET_DATA_INV_OPENING_BLC_IMPORT({ payload }) {
  yield put({
    type: 'setInvOpeningBalance/SET_STATE',
    payload: {
      loadingFile: true,
    },
  })
  try {
    const result = yield call(GET_API_IMPORT, payload)
    const { data, acknowledge, message } = result
    if (acknowledge) {
      yield put({
        type: 'setInvOpeningBalance/SET_STATE',
        payload: {
          setInvOpeningBalanceImportData: {
            data,
          },
        },
      })
    } else {
      notification.error({
        message: vars.FLD_INV_OPENING_BLC,
        description: message,
        ...notifConfig,
      })
    }
  } catch (e) {
    notification.error({
      message: vars.FLD_INV_OPENING_BLC,
      description: vars.RTO,
      ...notifConfig,
    })
  } finally {
    yield put({
      type: 'setInvOpeningBalance/SET_STATE',
      payload: {
        loadingFile: false,
      },
    })
  }
}

function* HANDLE_CONTENT({ payload }) {
  yield put({
    type: 'setInvOpeningBalance/SET_STATE',
    payload: {
      contentStatus: payload,
    },
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery('setInvOpeningBalance/HANDLE_STATE', HANDLE_STATE),
    takeEvery('setInvOpeningBalance/GET_DATA_INV_OPENING_BLC_LIST', GET_DATA_INV_OPENING_BLC_LIST),
    takeEvery(
      'setInvOpeningBalance/GET_DATA_INV_OPENING_BLC_DETAIL',
      GET_DATA_INV_OPENING_BLC_DETAIL,
    ),
    takeEvery('setInvOpeningBalance/GET_DATA_INV_OPENING_BLC_SAVE', GET_DATA_INV_OPENING_BLC_SAVE),
    takeEvery(
      'setInvOpeningBalance/GET_DATA_INV_OPENING_BLC_UPDATE',
      GET_DATA_INV_OPENING_BLC_UPDATE,
    ),
    takeEvery(
      'setInvOpeningBalance/GET_DATA_INV_OPENING_BLC_DELETE',
      GET_DATA_INV_OPENING_BLC_DELETE,
    ),
    takeEvery(
      'setInvOpeningBalance/GET_DATA_INV_OPENING_BLC_APPROVE',
      GET_DATA_INV_OPENING_BLC_APPROVE,
    ),
    takeEvery(
      'setInvOpeningBalance/GET_DATA_INV_OPENING_BLC_UNAPPROVE',
      GET_DATA_INV_OPENING_BLC_UNAPPROVE,
    ),
    takeEvery(
      'setInvOpeningBalance/GET_DATA_INV_OPENING_BLC_IMPORT',
      GET_DATA_INV_OPENING_BLC_IMPORT,
    ),
    takeEvery('setInvOpeningBalance/HANDLE_CONTENT', HANDLE_CONTENT),
  ])
}
