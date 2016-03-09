import {createStore, applyMiddleware } from 'redux';
import {fromJS} from 'immutable';
import reducer from './reducer';

import testState from './admin-state';//
const state = fromJS(testState);

export default function configureStore(initialState = state) {
  return createStore(
    reducer,
    initialState
  );
}
