import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../actions';
import { SelectField, TextField, MenuItem, RaisedButton, Paper, Card} from 'material-ui';
import UserList from './UserList';
import initialState from '../admin-state';


class Users extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {
        usertype: null,
        username: null,
        password: null
      }
    };
  }

  handleChange = (field, event, index, value) => {
    // material-ui SelectField passes index, value in addition to the react event.
    // field is bound manuallty to the callback in the component's render method
    value = value || event.target.value
    let data = this.state.data;
    data[field] = value;
    this.setState({data: data});
  }

  render() {
    const users = initialState.users.list;
    return (
      <div>
        <Paper style={{padding: 1.5 + 'rem', margin: 1 + 'rem'}}>
          <h2>Create User</h2>
          <form role='form'>
            <SelectField
              floatingLabelText="Select user type:"
              value={this.state.data.usertype}
              onChange={this.handleChange.bind(null, 'usertype')}>
                <MenuItem value="Basic User" primaryText="Basic User"/>
                <MenuItem value="Account Admin" primaryText="Account Admin" />
                <MenuItem value="Site Admin" primaryText="Site Admin" />
            </SelectField>
            <input
              name="usertype"
              type="text"
              value={this.state.data.usertype}
              style={{display: "none"}}/>
            <br />
            <TextField
              name="username"
              type="text"
              floatingLabelText = "User Name:"
              hintText= "jsmith"
              onChange={this.handleChange.bind(null, 'username')}
            />
            <br />
            <TextField
              name="password"
              type="password"
              floatingLabelText = "Password:"
              hintText= "********"
              onChange={this.handleChange.bind(null, 'password')}
            />
            <br />
            <RaisedButton
              label="Create User"
              primary={true}
              style={{marginTop: 10}}
              onTouchTap={() => this.props.createUser(this.state.data)}/>
          </form>
          <br />
        </Paper>
        <br />
        <Paper style={{padding: 1.5 + 'rem', margin: 1 + 'rem', marginTop: 0}}>
          <h2>Manage Users</h2>
          <UserList {...this.props} />
        </Paper>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  let users = state.getIn(['users', 'list']).toJS();
  return {
    users: users
  }
}

const UsersContainer = connect(
  mapStateToProps,
  actionCreators
)(Users);

export default UsersContainer;
