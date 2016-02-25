import React from 'react';
import {AppBar, MenuItem, IconButton, IconMenu, } from 'material-ui';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';

export default class TopBar extends React.Component {

  render() {
    return (
      <AppBar
        title="Admin"
        onLeftIconButtonTouchTap={this.props.menuToggle}
        iconElementRight={
          <IconMenu
            iconButtonElement={
              <IconButton><MoreVertIcon /></IconButton>
            }
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            <MenuItem primaryText="Charts"
              linkButtton
              href="/"
            />            
            <MenuItem primaryText="Placeholder" />
            <MenuItem primaryText="Sign out" />
          </IconMenu>
        }
      />
    );
  }

}
