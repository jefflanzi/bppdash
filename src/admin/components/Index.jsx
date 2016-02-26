import React from 'react';
import ReactDOM from 'react-dom';
import { SelectField, TextField, MenuItem, RaisedButton, Paper, Card} from 'material-ui';
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

  handleTest = event => {
    let filename = event.target.files[0].name;
    let data = this.state.data;
    data.file = filename;
    this.setState({data: data});
  }

  render() {

    return (
      <Paper style={{padding: 1.5 + 'rem', margin: 1 + 'rem'}}>
        <h2>Upload Test</h2>
        <form role="form" action="/data/upload" method="post" encType="multipart/form-data">
          <input name="username" type="text" value="test"/>
          <br />
          <input name="survey" type="text" value="test"/>
          <br />          
          <input name="chart" type="text" value="test"/>
          <br />
          <input name="file" ref="fileInput" type="file" />
          <br />
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
