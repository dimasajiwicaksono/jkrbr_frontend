import { all, call, put, takeEvery } from 'redux-saga/effects'
import axios from 'axios'
import { notification } from 'antd'
import { getLeftMenuData } from 'services/menu'
import config from '../../utils/config'
import { getHeader } from '../../utils/master'
import { notifConfig } from '../../utils/helper'
import actions from './actions'

function GET_API_MENU_DATA() {
  const payload = {}
  return axios.post(config.API_MAINMENU, payload, { headers: getHeader() }).then(res => res.data)
}

function GET_API_MODULE_MASTER() {
  return axios.get(config.API_MODULE_MASTER, { headers: getHeader() }).then(res => res.data)
}

export function* GET_DATA() {
  try {
    const menuLeftData = yield call(getLeftMenuData)
    const menuData = yield call(GET_API_MENU_DATA)
    const menuTopData = []
    const menuSideData = []
    menuData.data.top.map(value => menuTopData.push(value))
    menuTopData.push({
      icon: 'icmn icmn-exit',
      key: 'logout',
      title: 'Logout',
    })
    menuData.data.side.map(value => menuSideData.push(value))
    // HIDE A/p Voucher ,Reconciale dihide ,Journal memorial dihide ,Finance feature Dihide
    const hideMenuFinance = ['0301', '0304', '0306', '0309']
    const indexFinance = menuSideData.map(el => el.key).indexOf('03')
    if (indexFinance >= 0) {
      menuSideData[indexFinance].children = menuSideData[indexFinance].children.filter(
        el => !hideMenuFinance.includes(el.key),
      )
    }

    yield put({
      type: 'menu/SET_STATE',
      payload: {
        menuLeftData,
        menuTopData,
        menuSideData,
      },
    })
  } catch (e) {
    console.log(e)
    localStorage.clear()
    notification.error({
      message: 'Failed',
      description: 'Something went wrong. Please try again later.',
      ...notifConfig,
    })
  } finally {
    yield put({
      type: 'menu/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export function* GET_SIDEDATA({ payload }) {
  const { menuSideData, key } = payload
  const menuSideDataSelected = []
  if (key === '00') {
    menuSideDataSelected.push({
      key: '00',
      title: 'Profile',
      icon: '',
      children: [
        {
          key: '0001',
          title: 'Change Password',
          icon: '',
          module: '',
          children: [],
        },
        {
          key: '0002',
          title: 'Change PIN POS',
          icon: '',
          module: '',
          children: [],
        },
      ],
    })
  }

  menuSideData.filter(value => value.key === key).map(val => menuSideDataSelected.push(val))
  yield put({
    type: 'menu/SET_STATE',
    payload: {
      menuSideDataSelected,
    },
  })
}

export function* GET_MODULE_MASTER() {
  try {
    const result = yield call(GET_API_MODULE_MASTER)
    const { acknowledge, data, message } = result
    if (acknowledge === 1) {
      const menuMaster = []
      data.map(val =>
        val.subMenu.map(vals =>
          menuMaster.push({
            moduleId: val.module_id,
            moduleName: val.modulename,
            functId: vals.functId,
            functName: vals.functName,
            isDelete: vals.isDelete,
            isDor: vals.isDor,
            isDownload: vals.isDownload,
            isEdit: vals.isEdit,
            isNew: vals.isNew,
            isPosting: vals.isPosting,
            isPosting1: vals.isPosting1,
            isPosting2: vals.isPosting2,
            isUnPosting: vals.isUnPosting,
            isUnPosting1: vals.isUnPosting1,
            isUnPosting2: vals.isUnPosting2,
            isUpload: vals.isUpload,
            isView: vals.isView,
          }),
        ),
      )

      const menuMasterList = data.map(val => ({
        moduleName: val.modulename,
        data: val.subMenu.map((el, keys) => ({
          moduleId: val.module_id,
          moduleName: val.modulename,
          functId: el.functId,
          functName: el.functName,
          isDelete: null,
          isDor: null,
          isDownload: null,
          isEdit: null,
          isNew: null,
          isPosting: null,
          isPosting1: null,
          isPosting2: null,
          isUnPosting: null,
          isUnPosting1: null,
          isUnPosting2: null,
          isUpload: null,
          isView: null,
          isChecked: 0,
          key: keys,
        })),
      }))

      yield put({
        type: 'menu/SET_STATE',
        payload: {
          menuMaster,
          menuMasterList,
        },
      })
    } else {
      console.log(message)
      notification.error({
        message: 'Error',
        description: 'Something went wrong. Please try again later.',
        ...notifConfig,
      })
    }
  } catch (e) {
    console.log(e)
    notification.error({
      message: 'Error',
      description: 'Something went wrong. Please try again later.',
      ...notifConfig,
    })
  }
}

export function* HANDLE_STATE({ field, value }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      [field]: value,
    },
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_MODULE_MASTER, GET_MODULE_MASTER),
    takeEvery(actions.GET_SIDEDATA, GET_SIDEDATA),
    takeEvery(actions.GET_DATA, GET_DATA),
    takeEvery(actions.HANDLE_STATE, HANDLE_STATE),
  ])
}
