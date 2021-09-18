import actions from './actions'

const initialState = {
  title: '',
  loading: true,
  menuMaster: [],
  menuLeftData: [],
  menuTopData: [],
  menuMasterList: [],
  menuSideData: [],
  menuSideDataSelected: [],
  isInventoryReport: true,
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
