import actions from './actions'

const initialState = {
  loading: true,
  loadingFile: false,
  loadingDetail: false,
  loadingOption: false,
  loadingProcess: false,
  setInvOpeningBalanceData: [],
  setInvOpeningBalanceDetail: [],
  setInvOpeningBalanceImportData: [],
  contentStatus: 'isView',
  setInvOpeningBalanceSelectedRow: '',
  customerOption: [],
  customerLocationOption: [],
  customerContactOption: [],
  brandOption: [],
  outletOption: [],
  locationOption: [],
  salesOrderOption: [],
  salesOrderDetailOption: [],
  categoryOption: [],
  itemsOption: [],
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
