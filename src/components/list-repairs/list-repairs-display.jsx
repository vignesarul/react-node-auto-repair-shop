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
    return <button type="button" className="btn btn-secondary btn-sm" data-userId={props.userId} data-id={props.id} onClick={props.markApproved}>Mark Approved</button>;
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
};

class ListRepairs extends React.Component {
  componentDidMount() {
    if (this.props.repairsList.length === 0) {
      this.props.retriveRepairs(this.props.match.params.userId);
    }
  }

  componentWillReceiveProps(props) {
    if (props.match.params.userId !== this.props.match.params.userId) {
      this.props.retriveRepairs(props.match.params.userId);
    }
  }

  render() {
    return (<div className="py-5">
      <div className="container">
        <div className="row">
          <Sidebar userId={this.props.user.id} />
          <div className="col-md-9">
            <div style={{ textAlign: 'right', marginBottom: '10px' }}>
              <button type="button" className={this.props.isLoading ? 'btn btn-warning btn-sm' : 'btn btn-secondary btn-sm'} disabled={this.props.isLoading} data-userId={this.props.match.params.userId} onClick={this.props.refreshData}>
                {this.props.isLoading ? <i className="fa fa-spinner" /> : ''}
                Refresh Data
              </button>
            </div>
            <div className="card">
              <div className="card-header">Repairs</div>
              {(this.props.info || this.props.error) ? <AlertMessage message={this.props} /> : ''}
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
                    {(this.props.repairsList || []).map(repair => (<tr key={repair.id}>
                      <td>{repair.attributes.title}</td>
                      <td>{repair.attributes.userId}</td>
                      <td>
                        {repair.attributes.date} {repair.attributes.time} to <br />
                        {addTime(_.pick(repair.attributes, ['date', 'time'])).date} {addTime(_.pick(repair.attributes, ['date', 'time'])).time}</td>
                      <td>
                        <Link to={`/users/${repair.attributes.userId}/repairs/${repair.id}`}><i className="fa fa-edit" /></Link> &nbsp;
                        <Link to={`/users/${repair.attributes.userId}/repairs/${repair.id}`}><i className="fa fa-trash" /></Link> &nbsp;
                        {console.log(this.props)}
                        <ActionButtons {...repair.attributes} id={repair.id} role={this.props.user.attributes.roles} markApproved={this.props.markApproved} markCompleted={this.props.markCompleted} />
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
  user: PropTypes.shape({
    id: PropTypes.string,
    attributes: PropTypes.shape({
      roles: PropTypes.string.isRequired,
    }),
  }),
  info: PropTypes.string,
  error: PropTypes.shape({
    code: PropTypes.string,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  repairsList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
  })),
  isLoading: PropTypes.bool.isRequired,
  retriveRepairs: PropTypes.func.isRequired,
  markApproved: PropTypes.func.isRequired,
  markCompleted: PropTypes.func.isRequired,
  refreshData: PropTypes.func.isRequired,
};

ListRepairs.defaultProps = {
  repairsList: [],
  user: {},
  error: {},
  info: '',
};

export default ListRepairs;
