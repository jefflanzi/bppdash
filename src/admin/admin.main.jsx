import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

// Grid
import { Grid, Row, Col } from 'react-bootstrap';

// Components
import {AppBar, Card, LeftNav, MenuItem} from 'material-ui';
// import AppBar from 'material-ui/lib/app-bar';
// import LeftNav from 'material-ui/lib/left-nav';
// import MenuItem from 'material-ui/lib/menus/menu-item';
// import RaisedButton from 'material-ui/lib/raised-button';

class Layout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: true};
  }

  handleToggle = () => this.setState({open: !this.state.open});

  render() {
    return (
      <Grid fluid={true}>
        <Row>
          <AppBar
            title="Title"
            onLeftIconButtonTouchTap={this.handleToggle}
          />
        </Row>
        <Row>
          <Col md={4}>
            <LeftNav open={this.state.open}>
              <MenuItem onTouchTap={this.handleClose}>Surveys</MenuItem>
              <MenuItem onTouchTap={this.handleClose}>Data</MenuItem>
            </LeftNav>
          </Col>
          <Col md={8}>
            Content
          </Col>
        </Row>
      </Grid>
    );
  }

}

ReactDOM.render(<Layout />, document.getElementById('admin'));
