import {List, Map, fromJS} from 'immutable';

function createUser(state, user) {
  // Update state using Immutable.js
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

export default function reducer(state, action) {
  switch(action.type) {
    case 'CREATE_USER':
      return createUser(state, action.user);
    case 'DELETE_USER':
      return deleteUser(state, action.username);
    default:
      return state;
  }
}
