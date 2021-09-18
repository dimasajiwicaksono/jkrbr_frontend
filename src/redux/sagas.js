import { all } from 'redux-saga/effects'
import user from './user/sagas'
import menu from './menu/sagas'
import settings from './settings/sagas'
import dashboard from './dashboard/sagas'

/* POS */
import posPointOfSales from './pos/posPointOfSales/sagas'
import posKasir from './pos/posKasir/sagas'
import posReport from './pos/posReport/sagas'
/* POS */
import setInvOpeningBalance from './setup/setInvOpeningBalance/sagas'
import setInvOpeningCOA from './setup/setInvOpeningCOA/sagas'
import membership from './membership/sagas'

export default function* rootSaga() {
  yield all([
    user(),
    menu(),
    settings(),
    dashboard(),
    posPointOfSales(),
    posKasir(),
    posReport(),
    membership(),
    setInvOpeningBalance(),
    setInvOpeningCOA(),
  ])
}
