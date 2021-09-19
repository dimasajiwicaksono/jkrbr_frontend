import actions from './actions'

const token =
  localStorage.getItem('Token') &&
    localStorage.getItem('Token') !== '' &&
    localStorage.getItem('Token') !== undefined
    ? localStorage.getItem('Token')
    : ''
const initialState = {
  status: 200,
  token,
  username: '',
  authorized: false,
  tokenRajaAPI:"",
  loading: false,
  loadingCheckToken: false,
  loadingChgPwd: false,
  loadingChgPIN: false,
  loadingRegister: false,
  isSuccessChgPwd: false,
  config: [],
  outlet: [],
  company: [],
  mstCompanyData: []
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
