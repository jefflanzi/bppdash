import React from 'react';
import { SelectField, TextField, MenuItem, RaisedButton, Paper} from 'material-ui';

// Mock user data
const users = [
  { id: 1, username: 'User 1' },
  { id: 2, username: 'User 2' },
  { id: 3, username: 'User 3' }
];


export default class Surveys extends React.Component {

  constructor(props) {
    super(props);
    this.state = {value: null};
  }

  handleChange = (event, index, value) => this.setState({value});

  render() {

    return (
      <Paper style={{padding: 1.5 + 'rem', margin: 1 + 'rem'}}>
        <h2>Create new survey</h2>
        <form>
          <SelectField
            value={this.state.value}
            onChange={this.handleChange}
            floatingLabelText="Select user:"
          >            
            {users.map(user =>
              <MenuItem key={user.id} value={user.username} primaryText={user.username}/>
            )}
          </SelectField>
          <br />
          <TextField
            hintText="e.g. 2016 customer survey"
            floatingLabelText="Survey Name:"
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