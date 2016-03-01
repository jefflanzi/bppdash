
export default function reducer(state = INITIAL_STATE, action) {
  switch(action.type) {
    case 'CREATE_USER':
      return createUser(state, action.entry);
    case: 'CREATE_SURVEY':
      return createSurvey(state, action.entry);
    case: 'CREATE_CHART':
      return createChart(state, action.data);
  }
}
