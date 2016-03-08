import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

import Admin from './Admin.jsx';
import Index from './components/Index';
import Users from './components/Users';
import Surveys from './components/Surveys';
import Charts from './components/Charts';

render((
  <Router history={hashHistory}>
    <Route path="/" component={Admin}>
      <IndexRoute component={Index} />
      <Route path="users" component={Users} />
      <Route path="surveys" component={Surveys} />
      <Route path="charts" component={Charts} />
    </Route>
  </Router>
), document.getElementById('admin'));
