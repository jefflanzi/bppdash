import fetch from 'isomorphic-fetch';
import {List, Map, fromJS} from 'immutable';

export function setState(state) {
  return {
    type: 'SET_STATE',
    state
  }
}

export function createUser(user) {
  return {
    type: 'CREATE_USER',
    user
  };
}

export function deleteUser(username) {
  return {
    type: 'DELETE_USER',
    username: username
  }
}

// ASYNC ACTIONS

export function requestUsers() {
  return {
    type: 'REQUEST_USERS'
  }
}
//
export function receiveUsers(json) {
  console.log(json);
  return {
    type: 'RECEIVE_USERS',
    users: json,
    receivedAt: Date.now()
  }
}

export function fetchUsers() {
  return function (dispatch) {
    dispatch(requestUsers())
    return fetch('/user', {credentials: 'same-origin'})
      .then(response => response.json())
      .then(json =>
        dispatch(receiveUsers(json))
      )
      // TODO: catch errors
  }
}
//
// function shouldFetchUsers(state, view) {
//   const users = state.usersById[view]
//   if (!users) {
//     return true;
//   } else if (users.isFetching) {
//     return false;
//   } else {
//     return users.didInvalidate;
//   }
// }
//
// export function fetchUsersIfNeeded(view) {
//   return (dispatch, getState) => {
//     if (shouldFetchUsers(getState(), view)) {
//       return dispatch(fetchUsers(view))
//     } else {
//       return Promise.resolve();
//     }
//   }
// }
