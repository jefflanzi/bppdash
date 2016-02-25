import React from 'react';
import ReactDOM from 'react-dom';
import { RaisedButton } from 'material-ui';

export default class FileInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = { value: null }
  }

  handleChange = (event, index, value) => {
    console.log(value);
    this.setState({value});
  }

  handleUpload = () => {
    var fileUploadDom = ReactDOM.findDOMNode(this.refs.fileUpload);
    fileUploadDom.click();
  }

  render() {
    return(
    <div>
      <RaisedButton
        label={this.props.label}
        onClick={this.handleUpload}
      />
      <input
        ref="fileUpload"
        type="file"
        style={{"display": "none"}}
        onChange={this.handleChange}
      />
      <span>{this.state.value}</span>
    </div>
    );
  }

}
