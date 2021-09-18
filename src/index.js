import React from 'react'
import axios from 'axios'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { logger } from 'redux-logger'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'connected-react-router'
import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createHashHistory } from 'history'
import reducers from 'redux/reducers'
import sagas from 'redux/sagas'
import Router from 'router'
import Localization from 'components/LayoutComponents/Localization'
import * as serviceWorker from './serviceWorker'

// app styles
import './global.scss'

const history = createHashHistory()
const sagaMiddleware = createSagaMiddleware()
const routeMiddleware = routerMiddleware(history)
const middlewares = [thunk, sagaMiddleware, routeMiddleware]
if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger)
}
/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(reducers(history), composeEnhancers(applyMiddleware(...middlewares)))
/* eslint-enable */
sagaMiddleware.run(sagas)

axios.interceptors.response.use(
  response => {
    const { data } = response
    const { isLogOut } = data
    if (isLogOut !== undefined && isLogOut === 1) {
      store.dispatch({
        type: 'user/LOGOUT',
      })
    }
    return response
  },
  error => console.log(error, 'error'),
)

ReactDOM.render(
  <Provider store={store}>
    <Localization>
      <Router history={history} />
    </Localization>
  </Provider>,
  document.getElementById('root'),
)

serviceWorker.register()
export { store, history }
