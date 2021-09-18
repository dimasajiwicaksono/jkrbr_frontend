import { all, put, call, takeEvery } from 'redux-saga/effects'
import axios from 'axios'
import { notification } from 'antd'
import actions from './actions'
import config from '../../utils/config'
import { getHeader } from '../../utils/master'
import { notifConfig } from '../../utils/helper'
import vars from '../../utils/variable'

function GET_API_DATA() {
  return axios.get(config.API_DASHBOARD, { headers: getHeader() }).then(res => res.data)
}

export function* GET_DATA_DASHBOARD() {
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
      // CREATE NEW STRUCTURE DATA
      const { finace, purchase } = data
      // console.log(Object.values(finace))
      const newData = [
        // {
        //   header: {
        //     nameModule: 'Inventory',
        //     key: vars.MENU_KEY_INVENTORY
        //   },
        //   data: [
        //     {
        //       keyModule: { key: vars.MENU_KEY_INV_STOCK_OPNAME, title: 'Stock Opname' },
        //       amount: 25,
        //       status: 'alert',
        //       title: 'Alert Minimum Stock Item',
        //       roleAccess: 'isPosting',
        //     },
        //   ],
        // },
        {
          header: {
            nameModule: 'Finance',
            key: vars.MENU_KEY_FINANCE,
          },
          data: [
            {
              keyModule: { key: vars.MENU_KEY_FIN_PAYMENT_VOUCHER, title: 'Payment Voucher' },
              amount: finace.paymentVoucher,
              status: 'approve',
              title: 'Waiting Approve Payment Voucher',
              roleAccess: 'isPosting',
            },
            {
              keyModule: { key: vars.MENU_KEY_FIN_ISSUED_AP, title: 'Issued A/P' },
              amount: finace.isseud,
              status: 'approve',
              title: 'Waiting Approve Issued A/P',
              roleAccess: 'isPosting',
            },
            {
              keyModule: { key: vars.MENU_KEY_FIN_RECONCIALE_AP, title: 'Reconciale A/P' },
              amount: finace.reconciale,
              status: 'approve',
              title: 'Waiting Approve Reconciale A/P',
              roleAccess: 'isPosting',
            },
          ],
        }, // FINANCE
        {
          header: {
            nameModule: 'Purchase',
            key: vars.MENU_KEY_PURCHASE,
          },
          data: [
            {
              keyModule: {
                key: vars.MENU_KEY_PR_REQUEST_FOR_APPROVE,
                title: 'List Request Approval',
              },
              amount: purchase.purchaseRequest,
              status: 'approve',
              title: 'Waiting Approve Purchase Request',
              roleAccess: 'isPosting',
            },
            {
              keyModule: { key: '0506', title: 'Purchase Order' },
              amount: purchase.purchaseOrder,
              status: 'approve',
              title: 'Waiting Approve Purchase Order',
              roleAccess: 'isPosting',
            },
            {
              keyModule: { key: vars.MENU_KEY_PR_RECEIVING, title: 'Receiving' },
              amount: purchase.purchaseReciving,
              status: 'approve',
              title: 'Waiting Approve Purchase Receiving',
              roleAccess: 'isPosting',
            }, // PURCHASE
          ],
        },
      ]
      // SET NEW DATA TO REDUCERS
      yield put({
        type: actions.SET_STATE,
        payload: {
          dashboardData: newData,
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
      notification.error({
        message: vars.FLD_DASHBOARD,
        description: message,
        ...notifConfig,
      })
    }
  } catch (e) {
    console.log(e)
    notification.error({
      message: vars.FLD_DASHBOARD,
      description: vars.RTO,
      ...notifConfig,
    })
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
  yield all([takeEvery(actions.GET_DATA_LIST, GET_DATA_DASHBOARD)])
}
