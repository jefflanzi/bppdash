import React from 'react';

// Material UI components
import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';

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
        <h1>Menu</h1>
        {this.props.items.map(item =>
          <MenuItem
            onTouchTap={this.props.menuClose}
            key={item.id}>
              {item.label}
          </MenuItem>
        )}
      </LeftNav>
    );
  }

}
