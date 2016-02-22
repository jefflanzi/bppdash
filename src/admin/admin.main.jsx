import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

// Grid
import { Grid, Row, Col } from 'react-bootstrap';

// Components
import {AppBar, Card, LeftNav, MenuItem} from 'material-ui';

class Layout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  handleToggle = () => this.setState({open: !this.state.open});
  handleClose = () => this.setState({open: false});

  render() {
    return (
      <div id="site-wrapper">
        <LeftNav
          open={this.state.open}
          docked={false}
          onRequestChange={open => this.setState({open})}
        >
          <MenuItem onTouchTap={this.handleClose}>Surveys</MenuItem>
          <MenuItem onTouchTap={this.handleClose}>Data</MenuItem>
        </LeftNav>
        <div id="page-wrapper" style={{marginLeft: 250 + 'px'}}>
          <AppBar
            title="Title"
            onLeftIconButtonTouchTap={this.handleToggle}
          />
          <Grid fluid={false}>
            <Row>
              <Col md={4}>
                Content 1
              </Col>
              <Col md={8}>
                Content 2
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }

}

ReactDOM.render(<Layout />, document.getElementById('admin'));
