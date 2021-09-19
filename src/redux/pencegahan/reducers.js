import actions from './actions'

const initialState = {
  loading: false,
  error: false,
  pencegahanData: [],
  pencegahanDetail: [],
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
