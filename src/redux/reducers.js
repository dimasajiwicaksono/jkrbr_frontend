import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import user from './user/reducers'
import menu from './menu/reducers'
import settings from './settings/reducers'
import dashboard from './dashboard/reducers'
/* POS */
import posPointOfSales from './pos/posPointOfSales/reducers'
import posKasir from './pos/posKasir/reducers'
import posReport from './pos/posReport/reducers'
/* SETUP */
import setInvOpeningBalance from './setup/setInvOpeningBalance/reducers'
import setInvOpeningCOA from './setup/setInvOpeningCOA/reducers'

/** TOOL */
import toolVoucher from './tool/voucher/reducers'
import membership from './membership/reducers'

// TTTT
import pencegahan from './pencegahan/reducers'
import pemberdayaan from './pemberdayaan/reducers'

export default history =>
  combineReducers({
    router: connectRouter(history),
    user,
    menu,
    settings,
    dashboard,
    membership,

    pencegahan,
    pemberdayaan,

    posPointOfSales,
    posKasir,
    posReport,
    setInvOpeningBalance,
    setInvOpeningCOA,
    toolVoucher,
  })
