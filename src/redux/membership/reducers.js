import actions from './actions'

const initialState = {
  loading: false,
  loadingProvince: false,
  loadingCity: false,
  loadingKecamatan: false,
  loadingLayananMasyarakat:false,
  error: false,
  membershipData: [],
  membershipDetail: [],
  layananMasyarakatList: [],
  province: [],
  city: [],
  district:[]
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
