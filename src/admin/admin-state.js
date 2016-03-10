const state = {
  menuOpen: false,
  users: {
    isFetching: false,
    lastUpdated: null,
    list: [
      {_id: 1, username: 'user1', usertype: 'site admin', password: 'pw1'},
      {_id: 2, username: 'user2', usertype: 'account admin', password: 'pw2'},
      {_id: 3, username: 'user3', usertype: 'basic user', password: 'pw3'}
    ]
  },
  surveys: {
    isFetching: false,
    lastUpdated: null,
    list: [
      {_id: 1, name: 'survey1'},
      {_id: 2, name: 'survey2'},
      {_id: 3, name: 'survey3'}
    ]
  },
  charts: {
    isFetching: false,
    lastUpdated: null,
    list: [
      {_id: 1, name: 'chart1'},
      {_id: 2, name: 'chart2'},
      {_id: 3, name: 'chart3'}
    ]
  }
};

export default state;
