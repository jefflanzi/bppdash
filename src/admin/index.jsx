import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store';
import { fetchUsersIfNeeded } from './actions';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
// import fetch from 'isomorphic-fetch';
// import 'babel-polyfill';

injectTapEventPlugin();

import reducer from './reducer';
import Admin from './components/Admin';
import Home from './components/Home';
import Users from './components/Users';
import Surveys from './components/Surveys';
import Charts from './components/Charts';

const store = configureStore();
store.dispatch(fetchUsersIfNeeded()).then(() =>
  console.log(store.getState())
);

render((
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route component={Admin}>
        <Route path="/" component={Home} />
        <Route path="users" component={Users} />
        <Route path="surveys" component={Surveys} />
        <Route path="charts" component={Charts} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('admin'));
