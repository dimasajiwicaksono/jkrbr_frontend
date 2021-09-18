import actions from './actions'

const initialState = {
  loading: false,
  loadingFile: false,
  loadingDetail: false,
  loadingOption: false,
  loadingProcess: false,
  setInvOpeningCOAData: [],
  setInvOpeningCOADetail: [],
  setInvOpeningCOAImportData: [],
  contentStatus: 'isView',
  setInvOpeningCOASelectedRow: '',
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
