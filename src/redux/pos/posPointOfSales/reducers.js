import actions from './actions'

const initialState = {
  loading: false,
  loadingDetail: false,
  loadingOption: false,
  loadingProcess: false,
  loadingOutelt: false,
  posPointOfSalesData: [],
  posPointOfSalesDetail: {
    loading: false,
  },
  contentStatus: 'isView',
  posPointOfSalesSelectedRow: '',
  pages: 0,
  brandOption: [],
  outletOption: [],
  locationOption: [],
  itemsOption: [],
  groupOption: [],
  categoryOption: [],
  marketDetailOption: [],
  fbOutletOption: [],
  outletSelected: '',
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
