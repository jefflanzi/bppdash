import React from 'react';
import LeftNav from './LeftNav';
import TopBar from './TopBar';

export default class Admin extends React.Component {

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
