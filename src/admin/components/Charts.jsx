import React from 'react';
import { SelectField, TextField, MenuItem, RaisedButton, Paper, Card} from 'material-ui';
import SelectInput from './SelectInput';
import FileInput from './FileInput';

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
    this.state = {
      data: {
        userInput: null,
        chartInput: null,
        fileInput: null
      }
    };
  }

  handleChange = (event, index, value) => {
    this.setState({value});
  }

  render() {

    return (
      <Paper style={{padding: 1.5 + 'rem', margin: 1 + 'rem'}}>
        <h2>Create a new chart</h2>
        <form>          
          <SelectInput
            ref="userInput"
            floatingLabelText="Select user:"
          >
            {users.map(user =>
              <MenuItem key={user.id} value={user.username} primaryText={user.username}/>
            )}
          </SelectInput>
          <br />

          <SelectInput
            ref="surveyInput"
            floatingLabelText="Select a survey:"
          >
            {surveys.map(survey =>
              <MenuItem key={survey.id} value={survey.surveyname} primaryText={survey.surveyname}/>
            )}
          </SelectInput>
          <br />

          <SelectInput
            ref="chartInput"
            floatingLabelText="Chart type:"
          >
            {charts.map(chart =>
              <MenuItem key={chart.type} value={chart.type} primaryText={chart.label}/>
            )}
          </SelectInput>
          <br />

          <label htmlFor="fileInput">Upload Data File:</label>
          <input ref="fileInput" name="fileInput" type="file"></input>
          <br />
          <FileInput label="test" />
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
