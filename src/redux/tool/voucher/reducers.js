import actions from './actions'

const initialState = {
  loading: true,
  loadingDetail: false,
  loadingOption: false,
  loadingProcess: false,
  toolVoucherData: [],
  toolVoucherDetail: {
    loading: false,
  },
  contentStatus: 'isView',
  toolVoucherSelectedRow: '',
  userList: [],
  outletOption: [],
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
