import actions from './actions'

const initialState = {
  loadingBrand: false,
  loadingOutlet: false,
  loadingLocation: false,
  loadingGroup: false,
  loadingCategory: false,
  contentStatus: 'isView',
  brandOption: [],
  outletOption: [],
  locationOption: [],
  groupOption: [],
  categoryOption: [],
  itemsOption: [],
}

export default function userReduser(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
