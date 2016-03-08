import {*} from './actions';

const initialState = {
  menuOpen: false,
  users: {
    isFetching: false,
    items: []
  },
  surveys: {
    isFetching: false,
    items: []
  },
  charts: {
    isFetching: false,
    items: []
  };
};

function users(state = [], action) {
  switch(action.type) {
    case REQUEST_USERS:
      return [
        ...state,
        {
          users
        }
      ]
  }
}


export default function reducer(state = INITIAL_STATE, action) {
  switch(action.type) {
    case 'GET_USERS':
      return getUsers();
    case 'CREATE_USER':
      return createUser(state, action.entry);
    case: 'CREATE_SURVEY':
      return createSurvey(state, action.entry);
    case: 'CREATE_CHART':
      return createChart(state, action.data);
    default:
      return state;
  }
}
