import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Sidebar from 'components/sidebar/sidebar-container';
import AlertMessage from 'components/alert-box/alert-box-display';

class EditUser extends React.Component {
  componentWillMount() {
    const { actionMethods, userStore } = this.props;
    if (userStore.info) {
      actionMethods.clearInfo();
    }
  }

  componentWillReceiveProps(props) {
    const { userStore } = props;
    if (userStore.info) {
      if (userStore.user.attributes.roles !== 'user') {
        this.props.history.push('/users');
      } else {
        this.props.history.push(`/users/${userStore.user.id}/repairs?userId=${userStore.user.id}`);
      }
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

              <div className="card-header">Edit Repair</div>
              {(userStore.info || userStore.error) ? <AlertMessage message={userStore} /> : ''}
              <div className="card-block">

                <form onSubmit={actionMethods.EditUser}>
                  <input type="hidden" name="userId" defaultValue={user.id} />
                  <div className="form-group">
                    <label htmlFor="firstName">FirstName</label>
                    <input type="text" name="firstName" className="form-control" defaultValue={user.attributes.firstName} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="date">Email</label>
                    <input type="text" name="email" className="form-control" defaultValue={user.attributes.email} />
                  </div>
                  <button type="submit" disabled={userStore.isLoading} className="btn btn-primary">Edit User</button>
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
  history: PropTypes.shape({
    push: PropTypes.func,
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
