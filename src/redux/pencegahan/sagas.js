import { all, put, call, takeEvery } from 'redux-saga/effects'
import axios from 'axios'
import { Modal } from 'antd'
import actions from './actions'
// import { dummyFetchRequest } from '../../utils/helper'

import config from '../../utils/config'



function ADD_API_PENCEGAHAN(payload) {
  return axios.post(config.API_PENCEGAHAN_SAVE, payload).then(res => res.data)
// console.log(payload)
//
//   const res = {
//   acknowledge: 1,
//     message: 'TT'
//   }
//
//   return dummyFetchRequest(res, 600)
}

export function* ADD_PENCEGAHAN({payload}) {
  try {
    yield put({
      type: actions.SET_STATE,
      payload: {
        loading: true,
      },
    })
    const result = yield call(ADD_API_PENCEGAHAN, payload)
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
        content: message
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
    takeEvery(actions.ADD_PENCEGAHAN, ADD_PENCEGAHAN),
  ])
}
