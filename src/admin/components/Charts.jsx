import React from 'react';
import ReactDOM from 'react-dom';
import { SelectField, TextField, MenuItem, RaisedButton, Paper, Card} from 'material-ui';
import FileInput from './FileInput';

// Mock user data
const users = [
  { id: 1, username: 'test' },
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
        username: '',
        survey: '',
        chart: '',
        file: 'none'
      }
    };
  }

  handleChange = (field, event, index, value) => {
    let data = this.state.data;
    data[field] = value;
    this.setState({data: data});
  }

  handleUpload = (event, index, value) => {
    var button = ReactDOM.findDOMNode(this.refs.fileInput);
    button.click();
  }

  handleFileChange = event => {
    let filename = event.target.files[0].name;
    let data = this.state.data;
    data.file = filename;
    this.setState({data: data});
  }

  render() {

    return (
      <Paper style={{padding: 1.5 + 'rem', margin: 1 + 'rem'}}>
        <h2>Create a new chart</h2>
          <SelectField
            floatingLabelText="Select user:"
            value={this.state.data.username}
            onChange={this.handleChange.bind(null, 'username')}
          >
            {users.map(user =>
              <MenuItem
                key={user.id}
                value={user.username}
                primaryText={user.username}/>
            )}
          </SelectField>
          <br />
          <SelectField
            floatingLabelText="Select a survey:"
            value={this.state.data.survey}
            onChange={this.handleChange.bind(null, 'survey')}
          >
            {surveys.map(survey =>
              <MenuItem
                key={survey.id}
                value={survey.surveyname}
                primaryText={survey.surveyname}/>
            )}
          </SelectField>
          <br />
          <SelectField
            floatingLabelText="Chart type:"
            value={this.state.data.chart}
            onChange={this.handleChange.bind(null, 'chart')}
          >
            {charts.map(chart =>
              <MenuItem key={chart.type} value={chart.type} primaryText={chart.label}/>
            )}
          </SelectField>
          <br />
        <RaisedButton
          label="Choose a file"
          onClick={this.handleUpload}
          style={{marginTop: 10}}>
        </RaisedButton>
        <span style={{marginLeft: 1 + 'em'}}>Selected: {this.state.data.file}</span>

        <form role="form" action="/data/upload" method="post" encType="multipart/form-data">
          <div style={{display: 'none'}}>
            <input name="username" type="text" value={this.state.data.username} />
            <input name="survey" type="text" value={this.state.data.survey} />
            <input name="chart" type="text" value={this.state.data.chart} />
            <input name="file" type="file" />
            <input name="file" ref="fileInput" type="file"
              onChange={this.handleFileChange} style={{display: 'none'}}/>
          </div>          
          <RaisedButton
            label="Upload"
            type="submit"
            primary={true}
            style={{marginTop: 25}}
          />
        </form>
      </Paper>
    )
  }
}
