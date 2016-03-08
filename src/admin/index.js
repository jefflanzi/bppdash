import thunkMiddleware form 'redux-thunk';
import createLogger from 'redux-logger';
import {createStore, applyMiddleware } from 'redux';
import {selectView, fetchUsers } from './actions';
import rootReducer from './reducers'

const loggerMiddleware = createLogger();

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
)

store.dispatch(selectView('users'))
store.dispatch(fetchPostsIfNeeded('reactjs')).then(() =>
console.log(store.getState())
)
