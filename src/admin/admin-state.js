const state = {
  menuOpen: false,
  users: {
    isFetching: false,
    list: [
      {id: 1, username: 'user1', usertype: 'site admin', password: 'pw1'},
      {id: 2, username: 'user2', usertype: 'account admin', password: 'pw2'},
      {id: 3, username: 'user3', usertype: 'basic user', password: 'pw3'}
    ]
  },
  surveys: {
    isFetching: false,
    list: [
      {id: 1, name: 'survey1'},
      {id: 2, name: 'survey2'},
      {id: 3, name: 'survey3'}
    ]
  },
  charts: {
    isFetching: false,
    list: [
      {id: 1, name: 'chart1'},
      {id: 2, name: 'chart2'},
      {id: 3, name: 'chart3'}
    ]
  }
};

export default state;
