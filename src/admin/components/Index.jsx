import React from 'react';
import ReactDOM from 'react-dom';
import {Paper} from 'material-ui';

export default class Charts extends React.Component {

  render() {

    return (
      <Paper style={{padding: 1.5 + 'rem', margin: 1 + 'rem'}}>
        <h2>Welcome to the Admin UI</h2>
        <p>Open the menu from the top bar to select operations</p>
      </Paper>
    )
  }
}
