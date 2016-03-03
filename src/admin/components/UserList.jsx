import React from 'react';
import { Table, TableHeaderColumn, TableRow, TableHeader, TableRowColumn, TableBody } from 'material-ui';
import { IconButton } from 'material-ui/lib/icon-button';
import { FlatButton } from 'material-ui';
import DeleteIcon from 'material-ui/lib/svg-icons/action/delete';
import EditIcon from 'material-ui/lib/svg-icons/editor/mode-edit';

export default class UserList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {};
    this.getUsers();
  }

  getUsers = () => {
    fetch('/user', {credentials: 'same-origin'})
      .then(response => response.json())
      .then(json => this.setState({users: json}));
  }

  handleDelete = (userid) => {
    let url = '/user/' + userid;
    fetch(url, {method: 'post', credentials: 'same-origin'})
      .then(this.getUsers);
  }

  render() {
    const users = this.state.users;
    // if(!users) return <div>loading...</div>
    return <div>
      {!this.state.users ?
        <div>loading...</div> :
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>ID</TableHeaderColumn>
              <TableHeaderColumn>Username</TableHeaderColumn>
              <TableHeaderColumn>User Type</TableHeaderColumn>
              <TableHeaderColumn>Edit</TableHeaderColumn>
              <TableHeaderColumn>Delete</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user =>
              <TableRow key={user._id}>
                <TableRowColumn>{user._id}</TableRowColumn>
                <TableRowColumn>{user.username}</TableRowColumn>
                <TableRowColumn>{user.usertype}</TableRowColumn>
                <TableRowColumn>
                    <EditIcon style={{cursor: "pointer"}} hoverColor="#FF0000"/>
                </TableRowColumn>
                <TableRowColumn>
                    <FlatButton label="Delete" onTouchTap={this.handleDelete.bind(null, user._id)}/>
                </TableRowColumn>
              </TableRow>
            )}
          </TableBody>
        </Table>
      }
      </div>
  }
}
