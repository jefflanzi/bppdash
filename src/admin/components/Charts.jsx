import React from 'react';
import { SelectField, TextField, MenuItem, RaisedButton, Paper, Card} from 'material-ui';

// Mock user data
const users = [
  { id: 1, username: 'User 1' },
  { id: 2, username: 'User 2' },
  { id: 3, username: 'User 3' }
];

const surveys = [
  { id: 11, surveyname: 'Survey 1' },
  { id: 12, surveyname: 'Survey 2' },
  { id: 13, surveyname: 'Survey 3' }
];

const charts = [
  { type: 'SalesFunnel', label: 'Sales Funnel' },
  { type: 'Attributes', label: 'Attributes' },
  { type: 'MarketMap', label: 'MarketMap' },
  { type: 'BPI', label: 'Brand Performance Index' }
];

export default class Charts extends React.Component {

  constructor(props) {
    super(props);
    this.state = {value: null};
  }

  handleChange = (event, index, value) => this.setState({value});

  render() {

    return (
      <Paper style={{padding: 1.5 + 'rem', margin: 1 + 'rem'}}>
        <h2>Create a new chart</h2>
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
          <SelectField
            value={this.state.value}
            onChange={this.handleChange}
            floatingLabelText="Chart type:"
          >
            {charts.map(chart =>
              <MenuItem key={chart.type} value={chart.type} primaryText={chart.label}/>
            )}
          </SelectField>
          <br />
          <label>Upload Data File:</label>
          <input type="file"></input>
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
