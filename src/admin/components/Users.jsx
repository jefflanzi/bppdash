import React from 'react';
import { SelectField, TextField, MenuItem, RaisedButton, Paper, Card} from 'material-ui';

export default class Users extends React.Component {

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
    // material-ui Select Fieldpasses index, value in addition to the react event.
    // field is bound manuallty to the callback in the return function
    value = value || event.target.value
    let data = this.state.data;
    data[field] = value;
    this.setState({data: data});
  }

  render() {
    return (
      <Paper style={{padding: 1.5 + 'rem', margin: 1 + 'rem'}}>
        <h2>Create User</h2>
        <form role='form' action="/register" method="post">
          <SelectField
            floatingLabelText="Select user type:"
            value={this.state.data.usertype}
            onChange={this.handleChange.bind(this, 'usertype')}>
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
            floatingLabelText = "User Name:"
            hintText= "jsmith"
          />
          <br />
          <TextField
            name="password"
            floatingLabelText = "Password:"
            hintText= "********"
          />
          <br />
          <RaisedButton
            label="Create User"
            type="submit"
            primary={true}
            style={{marginTop: 10}}/>
        </form>
        <br />
      </Paper>
    )
  }
}
