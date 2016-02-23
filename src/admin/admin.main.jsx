import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import uuid from 'node-uuid';

injectTapEventPlugin();

// Grid
import { Grid, Row, Col } from 'react-bootstrap';

// Components
import {AppBar, LeftNav, MenuItem, SelectField, IconButton, IconMenu, TextField, RaisedButton, Paper} from 'material-ui';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';

class Layout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      menuItems: [
        {
          id: uuid.v4(),
          label: 'Users'
        },
        {
          id: uuid.v4(),
          label: 'Surveys'
        },
        {
          id: uuid.v4(),
          label: 'Charts'
        }
      ],
      users: [
        {
          id: uuid.v4(),
          username: 'User 1'
        },
        {
          id: uuid.v4(),
          username: 'User 2'
        },
        {
          id: uuid.v4(),
          username: 'User 3'
        }
      ],
      value: 1
    };

  }

  handleToggle = () => this.setState({open: !this.state.open});
  handleClose = () => this.setState({open: false});
  handleChange = (event, index, value) => this.setState({value});

  render() {
    const menuItems = this.state.menuItems;
    const users = this.state.users;

    return (
      <div id="site-wrapper">
        <LeftNav
          open={this.state.open}
          docked={false}
          onRequestChange={open => this.setState({open})}
        >
          <h1>Menu</h1>
          {menuItems.map(item =>
            <MenuItem
              onTouchTap={this.handleClose}
              key={item.id}>
                {item.label}
            </MenuItem>
          )}
        </LeftNav>
        <div id="page-wrapper" style={{marginLeft: 0 + 'px'}}>
          <AppBar
            title="Admin"
            onLeftIconButtonTouchTap={this.handleToggle}
            iconElementRight={
              <IconMenu
                iconButtonElement={
                  <IconButton><MoreVertIcon /></IconButton>
                }
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              >
                <MenuItem primaryText="Refresh" />
                <MenuItem primaryText="Help" />
                <MenuItem primaryText="Sign out" />
              </IconMenu>
            }
          />
          <Grid fluid={false}>
            <Row>
              <Col md={12}>
                <Paper style={{padding: 1.5 + 'rem', marginTop: 1 + 'rem'}}>
                  <h2>Create new survey</h2>
                  <form>
                    <SelectField
                      value={this.state.value}
                      onChange={this.handleChange}
                      floatingLabelText="Select user:"
                    >
                      <MenuItem value={1} primaryText="Default Value"/>
                      {users.map(user =>
                        <MenuItem key={user.id} value={user.username} primaryText={user.username}/>
                      )}
                    </SelectField>
                    <br />
                    <TextField
                      hintText="example survey"
                      floatingLabelText="Survey Name:"
                    />
                    <br />
                    <RaisedButton
                      label="Create"
                      primary={true}
                    />
                  </form>
                </Paper>
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }

}

ReactDOM.render(<Layout />, document.getElementById('admin'));
