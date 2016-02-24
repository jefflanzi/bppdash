import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import uuid from 'node-uuid';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';

injectTapEventPlugin();

// Components
import LeftNav from './components/LeftNav';
import TopBar from './components/TopBar';
import Index from './components/Index';
import Surveys from './components/Surveys';
import Test from './components/Test';

class Admin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false
    };

  }

  handleMenuToggle = () => this.setState({menuOpen: !this.state.menuOpen});
  handleMenuClose = () => this.setState({menuOpen: false});

  render() {
    const menuItems = this.state.menuItems;
    const users = this.state.users;

    return (
      <div id="site-wrapper">
        <LeftNav items = {menuItems}
          open = {this.state.menuOpen}
          menuClose={this.handleMenuClose}
        />
        <div id="page-wrapper" style={{marginLeft: 0 + 'px'}}>
          <TopBar menuToggle={this.handleMenuToggle} />
          {this.props.children}
        </div>
      </div>
    );
  }

}

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={Admin}>
      <IndexRoute component={Index} />
      <Route path="surveys" component={Surveys} />
      <Route path="test" component={Test} />
    </Route>
  </Router>
), document.getElementById('admin'));
