import React from 'react';
import { SelectField, TextField, MenuItem, RaisedButton, Paper, Card} from 'material-ui';

// Mock data
const users = [
  { id: 1, username: 'User 1' },
  { id: 2, username: 'User 2' },
  { id: 3, username: 'User 3' }
];
const userTypes = [
  {usertype: 'user', label: 'Basic User'},
  {usertype: 'accountadmin', label: 'Account Admin'},
  {usertype: 'sysadmin', label: 'System Admin'}
];

export default class Users extends React.Component {

  constructor(props) {
    super(props);
    this.state = {value: null};
  }

  handleChange = (event, index, value) => this.setState({value});

  render() {

    return (
      <Paper style={{padding: 1.5 + 'rem', margin: 1 + 'rem'}}>
        <h2>Create a new user</h2>
        <form>
          <SelectField
            value={this.state.value}
            onChange={this.handleChange}
            floatingLabelText="Select user type:"
          >
            {userTypes.map(u =>
              <MenuItem key={u.usertype} value={u.usertype} primaryText={u.label}/>
            )}
          </SelectField>
          <br />          
          <TextField
            hintText="e.g. bob"
            floatingLabelText="User Name:"
          />
          <br />
          <TextField
            hintText="********"
            floatingLabelText="Password:"
          />
          <br />
          <br />
          <RaisedButton
            label="Create"
            primary={true}
          />
        </form>
      </Paper>
    )
  }
}
