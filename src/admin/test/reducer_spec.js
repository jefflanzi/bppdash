import {List, Map, fromJS} from 'immutable';
import { expect } from 'chai';
import initialState from '../admin-state.js';

import reducer from '../reducer';

describe('reducer', () => {
  it('creates a new user', () => {
    const state = fromJS(initialState);
    const action = {
      type: 'CREATE_USER',
      user: {
        id: 4,
        username: 'newuser',
        usertype: 'site admin',
        password: 'pw4'
      }
    };
    const nextState = reducer(state, action);

    expect(nextState.getIn(['users', 'list'])).to.exist;
    expect(nextState.getIn(['users', 'list']).count()).to.equal(4);

  });

  it('deletes a user by username', () => {
    const state = fromJS(initialState);
    const action = {
      type: 'DELETE_USER',
      username: 'user3'
    }
    const nextState = reducer(state, action);

    expect(nextState.getIn(['users', 'list'])).to.exist;
    expect(nextState.getIn(['users', 'list']).count()).to.equal(2);

  });

});
