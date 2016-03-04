import {Map, List} from 'immutable';

const setState = (state, newState) => {
  return state.merge(newState);
}

const getUsers = (state) => {
  const currentUsers = state.get('users');

  fetch('/user', {credentials: 'same-origin'})
    .then(response => response.json())
    .then(json => state.set({users: json}));
}

export default function(state = Map(), action) {
  switch(action.type) {
    case 'GET_USERS':
      return getusers(state);
  }

  return state;
}
