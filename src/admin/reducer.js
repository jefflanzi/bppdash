import {List, Map, fromJS} from 'immutable';
import uuid from 'node-uuid';

function createUser(state, user) {
  // Update state using Immutable.js
  user.id = uuid.v4();
  const currentUsers = state.getIn(['users', 'list']);
  const newUsers = currentUsers.push(fromJS(user));
  const nextState = state.setIn(['users', 'list'], newUsers);

  return nextState;
}

function deleteUser(state, username) {
  const currentUsers = state.getIn(['users', 'list']);
  const newUsers = currentUsers.filterNot(user => user.get('username') === username);
  const nextState = state.setIn(['users', 'list'], newUsers);

  return nextState;
}

function requestUsers(state) {
  return state.setIn(['users', 'isFetching'], true)
}

function receiveUsers(state, action) {
  return state.set('users',
    Map({
      isFetching: false,
      lastUpdated: action.receivedAt,
      list: fromJS(action.users)
    })
  )
}

// user reducer
const defaultUsersState = { isFetching: false, lastUpdated: null, list: []}
function users(state = defaultUsersState, action) {
  switch(action.type) {
    case 'REQUEST_USERS':
      return state.setIn(['users', 'isFetching'], true)
    case 'RECEIVE_USERS':
      return state.set('users', Map({
        isFetching: false,
        lastUpdated: action.receivedAt,
        list: fromJS(action.users)
      })
    )
    default:
      return state
  }
}

export default function reducer(state, action) {
  switch(action.type) {
    case 'REQUEST_USERS':
      return requestUsers(state);
    case 'RECEIVE_USERS':
      return receiveUsers(state, action)
    case 'CREATE_USER':
      return createUser(state, action.user);
    case 'DELETE_USER':
      return deleteUser(state, action.username);
    default:
      return state;
  }
}
