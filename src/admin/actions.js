import fetch from 'isomorphic-fetch';

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



// export const SELECT_VIEW = 'SELECT_VIEW'
// export function selectView(view) {
//   return {
//     type: SELECT_VIEW,
//     view
//   }
// }
//
// export const INVALIDATE_VIEW = 'INVALIDATE_VIEW'
// export function invalidateView(view) {
//   return {
//     type: INVALIDATE_VIEW,
//     view
//   }
// }
//
// // ASYNC FUNCTIONS
//
// export const REQUEST_USERS = 'REQUEST_USERS'
// export function requestUsers(view) {
//   return {
//     type: REQUEST_USERS
//     view
//   }
// }
//
// export const RECEIVE_USERS = 'RECEIVE_USERS'
// export function receiveUsers(view, json) {
//   return {
//     type: RECEIVE_USERS,
//     view,
//     users: json.data.children.map(child => child.data),
//     receivedAt: Date.now()
//   }
// }
//
// function fetchUsers(view) {
//   return function (dispatch) {
//     dispatch(requestUsers(view))
//     return fetch('/users')
//       .then(response => response.json())
//       .then(json =>
//         dispatch(receivePosts(view, json))
//       )
//       // TODO: catch errors
//   }
// }
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
