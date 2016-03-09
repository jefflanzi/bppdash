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

  render() {
    console.log('UserList.props.users: \n', this.props.users);
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
            <TableRow key={user.id}>
              <TableRowColumn>{user.id}</TableRowColumn>
              <TableRowColumn>{user.username}</TableRowColumn>
              <TableRowColumn>{user.usertype}</TableRowColumn>
              <TableRowColumn>
                  <EditIcon style={{cursor: "pointer"}} hoverColor="#FF0000"/>
              </TableRowColumn>
              <TableRowColumn>
                  <FlatButton label="Delete" onTouchTap={() => this.props.deleteUser(user.username)}/>
              </TableRowColumn>
            </TableRow>
          )}
        </TableBody>
      </Table>
    )
  }
}
