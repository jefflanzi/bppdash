import {Map, fromJS} from 'immutable';
import { expect } from 'chai';
import configureStore from '../store';

import testState from '../admin-state';
const initialState = fromJS(testState);

describe('store', () => {

  const store = configureStore(initialState);


  it('is a Redux store configured with a reducer', () => {
    expect(store.getState()).to.equal(initialState);
  });

  it('dispatches CREATE_USER', () => {
    const action = {
      type: 'CREATE_USER',
      user: {
        id: 4,
        username: 'newuser',
        usertype: 'site admin',
        password: 'pw4'
      }
    };
    store.dispatch(action);
    expect(store.getState().getIn(['users', 'list'])).to.exist;
    expect(store.getState().getIn(['users', 'list']).count()).to.equal(4);
  });

  it('dispatches DELETE_USER', () => {
    const action = {
      type: 'DELETE_USER',
      username: 'user2'
    }

    store.dispatch(action);
    expect(store.getState().getIn(['users', 'list']).count()).to.equal(3);    

  });

});
