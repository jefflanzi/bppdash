import React from 'react';
import SelectField from 'material-ui/lib/select-field';

export default class SelectInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {value: null};
  }

  handleChange = (event, index, value) => {
    this.setState({value});
  }

  render() {
    return (
      <SelectField
        value={this.state.value}
        onChange={this.handleChange}
        floatingLabelText={this.props.floatingLabelText}
      >
      {this.props.children}
      </SelectField>
    )
  }
}
