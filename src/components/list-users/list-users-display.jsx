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
    const { userStore, actionMethods } = this.props;
    return (<div className="py-5">
      <div className="container">
        <div className="row">
          <Sidebar />
          <div className="col-md-9">
            <div style={{ textAlign: 'right', marginBottom: '10px' }}>
              <button type="button" className={userStore.isLoading ? 'btn btn-warning btn-sm' : 'btn btn-secondary btn-sm'} disabled={userStore.isLoading} onClick={actionMethods.retriveUsers}>
                {userStore.isLoading ? <i className="fa fa-spinner" /> : ''}
                Refresh Data
              </button>
            </div>
            <div className="card">
              <div className="card-header">Users</div>
              {(userStore.info || userStore.error) ? <AlertMessage message={userStore} /> : ''}
              <div className="card-block">
                <table className="table">
                  <thead>
                    <tr>
                      <th />
                      <th>First Name</th>
                      <th>Email</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {_.keys(userStore.users || []).map(userId => (<tr key={userId}>
                      <td>{userStore.users[userId].attributes.roles === 'user' ? <i className="fa fa-fw fa-user" /> : <i className="fa fa-fw fa-users" /> }</td>
                      <td>{userStore.users[userId].attributes.firstName}</td>
                      <td>{userStore.users[userId].attributes.email}</td>
                      <td>
                        <Link to={`/users/${userId}/edit`}><i className="fa fa-edit" /></Link>&nbsp;
                        <i role="button" tabIndex={-1} className="fa fa-trash" data-userId={userId} onClick={actionMethods.deleteUser} /> &nbsp;
                        <Link to={`/users/${userId}/repairs/create`}><i className="fa fa-plus-square" /></Link>&nbsp;
                        <Link to={`/users/${userStore.user.id}/repairs?userId=${userId}`}><i className="fa fa-list" /></Link>
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
    deleteUser: PropTypes.func.isRequired,
  }).isRequired,
};

export default ListUser;
