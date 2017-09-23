import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Sidebar from 'components/sidebar/sidebar-container';
import AlertMessage from 'components/alert-box/alert-box-display';

class AddRepair extends React.Component {
  componentWillMount() {
    if (this.props.repairStore.info) {
      this.props.actionMethods.clearInfo();
    }
  }

  componentDidMount() {
    const { actionMethods } = this.props;
    actionMethods.getUsers();
  }

  componentDidUpdate() {
    if (this.props.repairStore.info) {
      this.props.history.push(`/users/${this.props.userStore.user.id}/repairs`);
    }
  }

  render() {
    const { repairStore, actionMethods, userStore } = this.props;
    return (<div className="py-5">
      <div className="container">
        <div className="row">
          <Sidebar userId={userStore.user.id} />
          <div className="col-md-9">
            <div className="card mx-auto w-100">

              <div className="card-header">Add Repair</div>
              {(repairStore.info || repairStore.error) ? <AlertMessage message={repairStore} /> : ''}
              <div className="card-block">

                <form onSubmit={actionMethods.createNewRepair}>
                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" required className="form-control" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="userId">User Id</label>
                    <select className="form-control" name="userId">
                      {_.keys(userStore.users).map(userId => <option key={userId} value={userId}>{`${userStore.users[userId].attributes.firstName} - ${userId}`}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input type="date" name="date" className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="time">Time</label>
                    <input
                      type="text"
                      pattern="^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]:[0-5][0-9]$"
                      name="time"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select className="form-control" name="status">
                      <option value="default">Default</option>
                      <option value="completed">Completed</option>
                      <option value="approved">Approved</option>
                    </select>
                  </div>
                  <button type="submit" disabled={repairStore.isLoading} className="btn btn-primary">Add Repair</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
  }
}

AddRepair.propTypes = {
  userStore: PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  repairStore: PropTypes.shape({
    info: PropTypes.string,
    error: PropTypes.shape({
      code: PropTypes.string,
    }),
    isLoading: PropTypes.bool.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  actionMethods: PropTypes.shape({
    createNewRepair: PropTypes.func.isRequired,
    clearInfo: PropTypes.func.isRequired,
    getUsers: PropTypes.func.isRequired,
  }).isRequired,
};

AddRepair.defaultProps = {
  user: {},
  error: {},
  info: '',
};

export default AddRepair;
