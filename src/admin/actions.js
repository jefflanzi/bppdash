import fetch from 'isomorphic-fetch';
import {List, Map, fromJS} from 'immutable';

// Action Creators
export function createUser(user) {
  return {
    type: 'CREATE_USER',
    user: user
  };
}

export function deleteUser(username) {
  return {
    type: 'DELETE_USER',
    username: username
  }
}

export function requestUsers() {
  return {
    type: 'REQUEST_USERS'
  }
}
//
export function receiveUsers(json) {
  return {
    type: 'RECEIVE_USERS',
    users: json,
    receivedAt: Date.now()
  }
}

// Async actions


// Fetch list of users
function fetchUsers() {
  return dispatch => {
    dispatch(requestUsers())
    return fetch('/user', {credentials: 'same-origin'})
      .then(response => response.json())
      .then(json => dispatch(receiveUsers(json)))
      // TODO: catch errors
  }
}

//
function shouldFetchUsers(state) {
  const users = state.getIn['users', 'list'];
  if (!users) {
    return true;
  } else if (users.isFetching) {
    return false;
  } else {
    return true;
  }
}

export function fetchUsersIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchUsers(getState())) {
      return dispatch(fetchUsers())
    } else {
      return Promise.resolve();
    }
  }
}

// Create new user
export function insertUser(user) {
  return dispatch => {
    return (
      fetch('/user', {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user),
          credentials: 'same-origin'
        })
      .then(response => response.json())
      .then(json => dispatch(createUser(json)))
    )
  }
}

// delete a user
export function requestDeleteUser(username) {
  return dispatch => {
    return(
      fetch('/user/delete/' + username, {
        method: 'post',
        credentials: 'same-origin'
      })
      .then(response => response.json())
      .then(json => dispatch(deleteUser(json.deleted)))
    )
  }
}
