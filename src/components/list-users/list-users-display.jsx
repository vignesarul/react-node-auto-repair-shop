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
                        <div className="btn-group">
                          <button type="button" className="btn btn-sm btn-primary">Actions</button>
                          <button type="button" className="btn btn-sm btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span className="sr-only">Toggle Dropdown</span>
                          </button>
                          <div className="dropdown-menu">
                            <Link to={`/users/${userId}/edit`} className="dropdown-item">Edit</Link>
                            {userId !== userStore.user.id ? <button type="button" className="dropdown-item" data-userId={userId} onClick={actionMethods.deleteUser}>Delete</button> : ''}
                            <Link to={`/users/${userId}/repairs/create`} className="dropdown-item">Add Repair</Link>
                            <Link to={`/users/${userStore.user.id}/repairs?userId=${userId}`} className="dropdown-item">List Repairs</Link>
                          </div>
                        </div>
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
