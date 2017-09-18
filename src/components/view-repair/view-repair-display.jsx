import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Sidebar from 'components/sidebar/sidebar-container';
import AlertMessage from 'components/alert-box/alert-box-display';

class ViewRepair extends React.Component {
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
    const { repairStore, userStore, match } = this.props;
    const repair = _.find(repairStore.repairsList, { id: match.params.repairId });
    return (<div className="py-5">
      <div className="container">
        <div className="row">
          <Sidebar />
          <div className="col-md-9">
            <div className="card mx-auto w-100">

              <div className="card-header">View Repair</div>
              {(repairStore.info || repairStore.error) ? <AlertMessage message={repairStore} /> : ''}
              <div className="card-block">
                <table className="table">
                  <tbody>
                    <tr>
                      <td>#Id</td>
                      <td>{repair.id}</td>
                    </tr>
                    <tr>
                      <td>Title</td>
                      <td>{repair.attributes.title}</td>
                    </tr>
                    <tr>
                      <td>Assigned to</td>
                      <td>{userStore.users[repair.attributes.userId] && userStore.users[repair.attributes.userId].attributes.firstName} - {repair.attributes.userId}</td>
                    </tr>
                    <tr>
                      <td>Date-Time</td>
                      <td>{repair.attributes.date} {repair.attributes.time}</td>
                    </tr>
                    <tr>
                      <td>Status</td>
                      <td>{(repair.attributes.approved && 'Approved') || (repair.attributes.completed && 'Completed') || 'Not Started'}</td>
                    </tr>
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

ViewRepair.propTypes = {
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
    clearInfo: PropTypes.func.isRequired,
  }).isRequired,
};

export default ViewRepair;
