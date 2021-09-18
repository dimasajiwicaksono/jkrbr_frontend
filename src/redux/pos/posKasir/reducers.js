import actions from './actions'

const initialState = {
  loading: true,
  loadingDetail: false,
  loadingOption: false,
  loadingProcess: false,
  loadingItem: false,
  loadingTenderMedia: false,
  loadingOutlet: false,

  optCustomer: [],
  dataItem: { data: [] },
  contentStatus: 'isView',
  isSuccess: false,
  optTenderMedia: [],
  optOutlet: [],
  selectedOutlet: '',
  billNo: '',
  outletCode: '',
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
