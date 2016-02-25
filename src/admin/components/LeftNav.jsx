import React from 'react';

// Material UI components
import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';

// Mock menu item data
const menuItems = [
  { id: 1, route: '/', text: 'Home' },
  { id: 2, route: '/users', text: 'Users' },
  { id: 3, route: '/surveys', text: 'Surveys'},
  { id: 4, route: '/charts', text:'Charts'}
];

export default class MyLeftNav extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: this.props.open};
  }

  render() {
    return (
      <LeftNav
        open={this.props.open}
        docked={false}
        onRequestChange={this.props.menuClose}
      >
        <h2 style={{paddingLeft: 0.5 + 'em'}}>Menu</h2>
        {menuItems.map(item =>
          <MenuItem key={item.id}
            onTouchTap={this.props.menuClose}
            linkbutton={true}
            containerElement={<Link to={item.route} />}
            primaryText={item.text}
          />
        )}

      </LeftNav>
    );
  }

}
