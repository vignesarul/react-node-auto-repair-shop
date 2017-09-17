import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Sidebar from 'components/sidebar/sidebar-container';
import AlertMessage from 'components/alert-box/alert-box-display';


class ListUser extends React.Component {
  componentWillMount() {
    const { actionMethods } = this.props;
    actionMethods.retriveUsers();
  }

  render() {
    const { userStore } = this.props;
    return (<div className="py-5">
      <div className="container">
        <div className="row">
          <Sidebar />
          <div className="col-md-9">
            <div className="card">
              <div className="card-header">Users</div>
              {(userStore.info || userStore.error) ? <AlertMessage message={userStore} /> : ''}
              <div className="card-block">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>First Name</th>
                      <th>Email</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {_.keys(userStore.users || []).map(userId => (<tr key={userId}>
                      <td>{userId}</td>
                      <td>{userStore.users[userId].attributes.firstName}</td>
                      <td>{userStore.users[userId].attributes.email}</td>
                      <td>
                        <Link to={`/users/edit/${userId}`}><i className="fa fa-edit" /></Link>&nbsp;
                        <Link to={`/users/edit/${userId}`}><i className="fa fa-trash" /></Link>&nbsp;
                        <Link to={`/users/${userId}/repairs/create`}><i className="fa fa-plus-square" /></Link>&nbsp;
                        <Link to={`/users/${userId}/repairs`}><i className="fa fa-list" /></Link>
                      </td>
                    </tr>))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
  }
}

ListUser.propTypes = {
  userStore: PropTypes.shape({
    error: PropTypes.shape({
      code: PropTypes.string,
    }),
    isLoading: PropTypes.bool.isRequired,
  }).isRequired,
  actionMethods: PropTypes.shape({
    retriveUsers: PropTypes.func.isRequired,
  }).isRequired,
};

export default ListUser;
