import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

import reducer from './reducers';
import Admin from './Admin';
import Home from './components/Home';
import Users from './components/Users';
import Surveys from './components/Surveys';
import Charts from './components/Charts';

let store = createStore(reducer);

render((
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={Admin}>
        <IndexRoute component={Home} />
        <Route path="users" component={Users} />
        <Route path="surveys" component={Surveys} />
        <Route path="charts" component={Charts} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('admin'));
