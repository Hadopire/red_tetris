import React from 'react'
import ReactDom from 'react-dom'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { storeStateMiddleWare } from './middleware/storeStateMiddleWare'
import reducer from './reducers'
import App from './containers/Game'

const store = createStore(
  reducer,
  applyMiddleware(thunk, createLogger())
)

ReactDom.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('tetris'))
