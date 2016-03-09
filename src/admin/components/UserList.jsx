import React from 'react';
import { connect } from 'react-redux';
import { createUser, deleteUser } from '../actions';
import * as actionCreators from '../actions';
import { Table, TableHeaderColumn, TableRow, TableHeader, TableRowColumn, TableBody } from 'material-ui';
import { IconButton } from 'material-ui/lib/icon-button';
import { FlatButton } from 'material-ui';
import DeleteIcon from 'material-ui/lib/svg-icons/action/delete';
import EditIcon from 'material-ui/lib/svg-icons/editor/mode-edit';
import {List, Map, fromJS, toJS } from 'immutable';

class UserList extends React.Component {
  // constructor(props) {
  //   super(props)
  //   this.state = {};
  //   this.getUsers();
  // }

  getUsers = () => {
    return this.props.users || [];
  }

  // getUsers = () => {
  //   fetch('/user', {credentials: 'same-origin'})
  //     .then(response => response.json())
  //     .then(json => this.setState({users: json}));
  // }

  // handleDelete = (userid) => {
  //   let url = '/user/' + userid;
  //   fetch(url, {method: 'post', credentials: 'same-origin'})
  //     .then(this.getUsers);
  // }

  render() {
    // if(!users) return <div>loading...</div>
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

const mapStateToProps = (state) => {
  let users = state.getIn(['users', 'list']).toJS();  
  return {
    users: users
  };
}

// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
//     handleDelete: (username) => {
//       dispatch(deleteUser(username))
//     }
//   }
// }

const UserListContainer = connect(
  mapStateToProps,
  actionCreators
)(UserList);

export default UserListContainer;
