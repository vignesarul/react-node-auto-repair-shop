import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Sidebar from 'components/sidebar/sidebar-container';
import AlertMessage from 'components/alert-box/alert-box-display';
import { addTime } from 'common/helpers/dateConverter';

const ActionButtons = (props) => {
  if (props.approved) {
    return <i className="fa fa-check-circle-o" style={{ color: 'green' }} title="Completed & Approved" />;
  } else if (props.completed && props.role !== 'user') {
    return (<div>
      <button type="button" className="btn btn-secondary btn-sm" data-userId={props.userId} data-id={props.id} onClick={props.markIncomplete}>Mark Incomplete</button>
      <button type="button" className="btn btn-secondary btn-sm" data-userId={props.userId} data-id={props.id} onClick={props.markApproved}>Mark Approved</button>
    </div>);
  } else if ((props.completed && props.role === 'user')) {
    return <i className="fa fa-hourglass-half" style={{ color: '#fb9d18' }} title="Completed" />;
  }
  return <button type="button" className="btn btn-secondary btn-sm" data-userId={props.userId} data-id={props.id} data-role={props.role} onClick={props.markCompleted}>Mark Completed</button>;
};

ActionButtons.propTypes = {
  id: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  approved: PropTypes.bool.isRequired,
  completed: PropTypes.bool.isRequired,
  markApproved: PropTypes.func.isRequired,
  markCompleted: PropTypes.func.isRequired,
  markIncomplete: PropTypes.func.isRequired,
};

class ListRepairs extends React.Component {
  componentWillMount() {
    const { repairStore, actionMethods } = this.props;
    if (repairStore.repairsList && repairStore.repairsList.length === 0) {
      actionMethods.retriveRepairs(this.props.match.params.userId);
    }
  }

  componentWillReceiveProps(props) {
    const { actionMethods } = this.props;
    const { repairStore } = props;
    if (props.match.params.userId !== this.props.match.params.userId) {
      actionMethods.retriveRepairs(props.match.params.userId);
    }
    (repairStore.repairsList || []).forEach(repair => this.getUserName(repair.attributes.userId, true));
  }

  getUserName(userId, getFromApi = false) {
    const { userStore, actionMethods } = this.props;
    if ((userStore.users || {})[userId]) return userStore.users[userId].attributes.firstName;
    if (_.isEmpty(userStore.error) && !userStore.isLoading && getFromApi) return actionMethods.getUser(userId);
    return userId;
  }

  render() {
    const { repairStore, userStore, actionMethods } = this.props;
    return (<div className="py-5">
      <div className="container">
        <div className="row">
          <Sidebar />
          <div className="col-md-9">
            <div style={{ textAlign: 'right', marginBottom: '10px' }}>
              <button type="button" className={repairStore.isLoading ? 'btn btn-warning btn-sm' : 'btn btn-secondary btn-sm'} disabled={repairStore.isLoading} data-userId={this.props.match.params.userId} onClick={actionMethods.refreshData}>
                {repairStore.isLoading ? <i className="fa fa-spinner" /> : ''}
                Refresh Data
              </button>
            </div>
            <div className="card">
              <div className="card-header">Repairs</div>
              {(repairStore.info || repairStore.error) ? <AlertMessage message={repairStore} /> : ''}
              <div className="card-block">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>User</th>
                      <th>Time</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(repairStore.repairsList || []).map(repair => (<tr key={repair.id}>
                      <td>{repair.attributes.title}</td>
                      <td>{this.getUserName(repair.attributes.userId)}</td>
                      <td>
                        {repair.attributes.date} {repair.attributes.time} to <br />
                        {addTime(_.pick(repair.attributes, ['date', 'time'])).date} {addTime(_.pick(repair.attributes, ['date', 'time'])).time}</td>
                      <td>
                        <Link to={`/users/${repair.attributes.userId}/repairs/${repair.id}/edit`}><i className="fa fa-edit" /></Link> &nbsp;
                        <i role="button" tabIndex={-1} className="fa fa-trash" data-userId={repair.attributes.userId} data-id={repair.id} onClick={actionMethods.deleteRepair} /> &nbsp;
                        <ActionButtons {...repair.attributes} id={repair.id} role={userStore.user.attributes.roles} markApproved={actionMethods.markApproved} markCompleted={actionMethods.markCompleted} markIncomplete={actionMethods.markIncomplete} />
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

ListRepairs.propTypes = {
  userStore: PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.string,
      attributes: PropTypes.shape({
        roles: PropTypes.string.isRequired,
      }),
    }),
    error: PropTypes.shape({
      code: PropTypes.string,
    }),
    isLoading: PropTypes.bool.isRequired,
  }).isRequired,
  repairStore: PropTypes.shape({
    info: PropTypes.string,
    error: PropTypes.shape({
      code: PropTypes.string,
    }),
    repairsList: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
    })),
    isLoading: PropTypes.bool.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  actionMethods: PropTypes.shape({
    retriveRepairs: PropTypes.func.isRequired,
    markApproved: PropTypes.func.isRequired,
    markCompleted: PropTypes.func.isRequired,
    refreshData: PropTypes.func.isRequired,
  }).isRequired,
};

ListRepairs.defaultProps = {
  repairsList: [],
  user: {},
  error: {},
  info: '',
};

export default ListRepairs;
