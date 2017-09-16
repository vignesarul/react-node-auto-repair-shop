import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Sidebar from 'components/sidebar/sidebar-container';
import AlertMessage from 'components/alert-box/alert-box-display';

class EditRepair extends React.Component {
  componentWillMount() {
    const { actionMethods, repairStore } = this.props;
    if (repairStore.info) {
      actionMethods.clearInfo();
    }
  }

  componentDidMount() {
    const { actionMethods } = this.props;
    actionMethods.getUsers();
  }

  componentDidUpdate() {
    const { repairStore, userStore } = this.props;
    if (repairStore.info) {
      this.props.history.push(`/users/${userStore.user.id}/repairs`);
    }
  }

  render() {
    const { repairStore, actionMethods, userStore, match } = this.props;
    const repair = _.find(repairStore.repairsList, { id: match.params.repairId });
    return (<div className="py-5">
      <div className="container">
        <div className="row">
          <Sidebar />
          <div className="col-md-9">
            <div className="card mx-auto w-100">

              <div className="card-header">Edit Repair</div>
              {(repairStore.info || repairStore.error) ? <AlertMessage message={repairStore} /> : ''}
              <div className="card-block">

                <form onSubmit={actionMethods.editRepair}>
                  <input type="hidden" name="id" defaultValue={repair.id} />
                  <input type="hidden" name="repairOwnerId" defaultValue={match.params.userId} />
                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" className="form-control" defaultValue={repair.attributes.title} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="userId">User Id</label>
                    <select className="form-control" name="userId" defaultValue={repair.attributes.userId}>
                      {_.keys(userStore.users).map(userId => <option key={userId} value={userId}>{`${userStore.users[userId].attributes.firstName} - ${userId}`}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input type="date" name="date" className="form-control" defaultValue={repair.attributes.date} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="time">Time</label>
                    <input
                      type="text"
                      pattern="^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]:[0-5][0-9]$"
                      name="time"
                      className="form-control"
                      defaultValue={repair.attributes.time}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select className="form-control" name="status" defaultValue={(repair.attributes.approved && 'approved') || (repair.attributes.completed && 'completed') || 'default'}>
                      <option value="default">Default</option>
                      <option value="completed">Completed</option>
                      <option value="approved">Approved</option>
                    </select>
                  </div>
                  <button type="submit" disabled={repairStore.isLoading} className="btn btn-primary">Edit Repair</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
  }
}

EditRepair.propTypes = {
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string,
      repairId: PropTypes.string,
    }),
  }).isRequired,
  actionMethods: PropTypes.shape({
    editRepair: PropTypes.func.isRequired,
    clearInfo: PropTypes.func.isRequired,
  }).isRequired,
};

export default EditRepair;
