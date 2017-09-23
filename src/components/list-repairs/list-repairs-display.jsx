import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import queryString from 'query-string';
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
  constructor() {
    super();
    this.refreshInitialData = this.refreshInitialData.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }
  componentWillMount() {
    this.refreshInitialData();
  }

  componentWillReceiveProps(props) {
    const { actionMethods, location } = this.props;
    const { repairStore } = props;
    const userId = queryString.parse(props.location.search).userId;
    if (userId && userId !== queryString.parse(location.search).userId) {
      actionMethods.retriveRepairs(userId);
    } else if (queryString.parse(location.search).userId && !userId) {
      this.refreshInitialData(true);
    }
    (repairStore.repairsList || []).forEach(repair => this.getUserName(repair.attributes.userId, true));
  }

  getUserName(userId, getFromApi = false) {
    const { userStore, actionMethods, repairStore } = this.props;
    if ((userStore.users || {})[userId]) return userStore.users[userId].attributes.firstName;
    if (_.isEmpty(userStore.error) && !userStore.isLoading && !repairStore.isLoading && getFromApi) return actionMethods.getUser(userId);
    return userId;
  }

  refreshInitialData(complete) {
    const { actionMethods, userStore } = this.props;
    const userIdToList = queryString.parse(this.props.location.search).userId;
    if (userStore.user.attributes.roles !== 'user' && (!userIdToList || complete)) {
      actionMethods.refreshAllRepair();
    } else {
      actionMethods.retriveRepairs(userIdToList);
    }
  }

  loadMore() {
    const { actionMethods, repairStore, userStore } = this.props;
    actionMethods.loadMore(userStore.user.roles, userStore.user.id, repairStore.next);
  }

  render() {
    const { repairStore, userStore, actionMethods } = this.props;
    return (<div className="py-5">
      <div className="container">
        <div className="row">
          <Sidebar />
          <div className="col-md-9">
            <div style={{ textAlign: 'right', marginBottom: '10px' }}>
              <button className="btn btn-secondary btn-sm" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                Advanced Search
              </button>&nbsp;
              <button
                type="button"
                className={repairStore.isLoading ? 'btn btn-warning btn-sm' : 'btn btn-secondary btn-sm'}
                disabled={repairStore.isLoading}
                data-userId={this.props.match.params.userId}
                onClick={this.refreshInitialData}
              >
                {repairStore.isLoading ? <i className="fa fa-spinner" /> : ''}
                Refresh Data
              </button>
              <div className="collapse" id="collapseExample">
                <div className="card card-block">
                  <form onSubmit={actionMethods[userStore.user.attributes.roles === 'user' ? 'performSearchByUser' : 'performSearch']}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group row">
                          <label htmlFor="example-text-input" className="col-2 col-form-label">UserId</label>
                          <div className="col-10">
                            <select className="form-control" name="userId">
                              {_.keys(userStore.users).map(userId => <option key={userId} value={userId}>{`${userStore.users[userId].attributes.firstName} - ${userId}`}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label htmlFor="example-search-input" className="col-2 col-form-label">Title</label>
                          <div className="col-10">
                            <input className="form-control" type="text" name="title" />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label htmlFor="example-search-input" className="col-2 col-form-label">Status</label>
                          <div className="col-10">
                            <select className="form-control" name="status">
                              <option value="default">Not started</option>
                              <option value="completed">Completed</option>
                              <option value="approved">Approved</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group row">
                          <label htmlFor="example-text-input" className="col-2 col-form-label">From</label>
                          <div className="col-10">
                            <input className="form-control" name="from" type="date" id="example-text-input" />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label htmlFor="example-search-input" className="col-2 col-form-label">To</label>
                          <div className="col-10">
                            <input className="form-control" name="to" type="date" id="example-search-input" />
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-10">
                            <button type="submit" className="btn btn-primary">Search</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
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
                      <th className="w-25">Time</th>
                      <th className="w-25">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(repairStore.repairsList || []).map(repair => (<tr key={repair.id}>
                      <td><Link to={`/users/${repair.attributes.userId}/repairs/${repair.id}`}>{repair.attributes.title}</Link></td>
                      <td><Link to={`/users/${repair.attributes.userId}/edit`}>{this.getUserName(repair.attributes.userId)}</Link></td>
                      <td>
                        {repair.attributes.date} {repair.attributes.time} to <br />
                        {addTime(_.pick(repair.attributes, ['date', 'time'])).date} {addTime(_.pick(repair.attributes, ['date', 'time'])).time}</td>
                      <td>
                        {userStore.user.attributes.roles !== 'user' ? <span>
                          <Link to={`/users/${repair.attributes.userId}/repairs/${repair.id}/edit`}><i className="fa fa-edit" /></Link> &nbsp;
                          <i role="button" tabIndex={-1} className="fa fa-trash" data-userId={repair.attributes.userId} data-id={repair.id} onClick={actionMethods.deleteRepair} /> &nbsp;
                        </span> : '' }
                        <ActionButtons {...repair.attributes} id={repair.id} role={userStore.user.attributes.roles} markApproved={actionMethods.markApproved} markCompleted={actionMethods.markCompleted} markIncomplete={actionMethods.markIncomplete} />
                      </td>
                    </tr>))}
                  </tbody>
                </table>
                <div>{!_.isEmpty(repairStore.next) ? <button className="btn btn-primary" onClick={this.loadMore}>Load More</button> : ''}</div>
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
    next: PropTypes.string,
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
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  actionMethods: PropTypes.shape({
    retriveRepairs: PropTypes.func.isRequired,
    markApproved: PropTypes.func.isRequired,
    markCompleted: PropTypes.func.isRequired,
    refreshAllRepair: PropTypes.func.isRequired,
  }).isRequired,
};

ListRepairs.defaultProps = {
  repairsList: [],
  user: {},
  error: {},
  info: '',
};

export default ListRepairs;
