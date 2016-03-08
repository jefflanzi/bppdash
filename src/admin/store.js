import {createStore, applyMiddleware } from 'redux';
import {fromJS} from 'immutable';
import reducer from './reducer';
// import testState from './admin-state';
//
// const initialState = fromJS(testState);

export default function configureStore(initialState) {
  return createStore(
    reducer,
    initialState
  );
}
