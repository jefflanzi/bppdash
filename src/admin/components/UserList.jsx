import React from 'react';
import { Table, TableHeaderColumn, TableRow, TableHeader, TableRowColumn, TableBody } from 'material-ui';
import { IconButton } from 'material-ui/lib/icon-button';
import { FlatButton } from 'material-ui';
import DeleteIcon from 'material-ui/lib/svg-icons/action/delete';
import EditIcon from 'material-ui/lib/svg-icons/editor/mode-edit';

export default class UserList extends React.Component {

  getUsers = () => {
    return this.props.users || [];
  }

  deleteUser = (username) => {
    fetch('/user/delete/' + username, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(json => console.log(json));
  }

  render() {
    // console.log('UserList.props.users: \n', this.props.users);
    return (
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
          {this.getUsers().map(user =>
            <TableRow key={user._id}>
              <TableRowColumn>{user._id}</TableRowColumn>
              <TableRowColumn>{user.username}</TableRowColumn>
              <TableRowColumn>{user.usertype}</TableRowColumn>
              <TableRowColumn>
                  <EditIcon style={{cursor: "pointer"}} hoverColor="#FF0000"/>
              </TableRowColumn>
              <TableRowColumn>
                  <FlatButton
                    label="Delete"
                    //onTouchTap={() => this.deleteUser(user.username)}
                    onTouchTap={() => this.props.requestDeleteUser(user.username)}
                  />
              </TableRowColumn>
            </TableRow>
          )}
        </TableBody>
      </Table>
    )
  }
}
