import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Sidebar from 'components/sidebar/sidebar-container';
import AlertMessage from 'components/alert-box/alert-box-display';

class EditUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updatedForm: '',
    };
    this.trackFormUpdate = this.trackFormUpdate.bind(this);
  }
  componentWillMount() {
    const { actionMethods, userStore } = this.props;
    if (userStore.info) {
      actionMethods.clearInfo();
    }
  }

  trackFormUpdate(e) {
    if (e.target.name) {
      this.setState({
        updatedForm: e.target.name,
      });
    }
  }

  render() {
    const { actionMethods, userStore, match } = this.props;
    const user = _.find(userStore.users, { id: match.params.userId });
    return (<div className="py-5">
      <div className="container">
        <div className="row">
          <Sidebar />
          <div className="col-md-9">
            <div className="card mx-auto w-100">

              <div className="card-header">Edit User</div>
              {((userStore.info || userStore.error) && this.state.updatedForm === 'editUser') ? <AlertMessage message={userStore} /> : ''}
              <div className="card-block">

                <form onSubmit={actionMethods.EditUser}>
                  <input type="hidden" name="userId" defaultValue={user.id} />
                  <div className="form-group">
                    <label htmlFor="firstName">FirstName</label>
                    <input type="text" name="firstName" required className="form-control" defaultValue={user.attributes.firstName} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="date">Email</label>
                    <input type="text" name="email" required className="form-control" defaultValue={user.attributes.email} />
                  </div>
                  <button type="submit" disabled={userStore.isLoading} onClick={this.trackFormUpdate} name="editUser" className="btn btn-primary">Edit User</button>
                </form>
              </div>
            </div>
            <br />
            { (userStore.user.attributes.roles !== 'user' && userStore.user.id !== user.id) ? <div><div className="card mx-auto w-100">
              <div className="card-header">Update Role</div>
              {((userStore.info || userStore.error) && this.state.updatedForm === 'updateRole') ? <AlertMessage message={userStore} /> : ''}
              <div className="card-block">
                <form onSubmit={actionMethods.updateRole}>
                  <input type="hidden" name="userId" defaultValue={user.id} />
                  <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <select className="form-control" name="role" defaultValue={user.attributes.roles}>
                      <option value="user">User</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                  <button type="submit" onClick={this.trackFormUpdate} disabled={userStore.isLoading} name="updateRole" className="btn btn-primary">Update Role</button>
                </form>
              </div>
            </div><br /></div> : '' }
            <div className="card mx-auto w-100">
              <div className="card-header">Update Password</div>
              {((userStore.info || userStore.error) && this.state.updatedForm === 'editPassword') ? <AlertMessage message={userStore} /> : ''}
              <div className="card-block">
                <form onSubmit={actionMethods.updatePassword}>
                  <input type="hidden" name="userId" defaultValue={user.id} />
                  <div className="form-group">
                    <label htmlFor="old">Current Password</label>
                    <input type="password" required name="old" className="form-control" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="new">New Password</label>
                    <input type="password" required name="new" className="form-control" />
                  </div>
                  <button type="submit" onClick={this.trackFormUpdate} disabled={userStore.isLoading} name="editPassword" className="btn btn-primary">Update Password</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
  }
}

EditUser.propTypes = {
  userStore: PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string,
    }),
  }).isRequired,
  actionMethods: PropTypes.shape({
    EditUser: PropTypes.func.isRequired,
    clearInfo: PropTypes.func.isRequired,
  }).isRequired,
};

export default EditUser;
