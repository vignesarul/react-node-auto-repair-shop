import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
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

  render() {
    const { repairStore, userStore, match, actionMethods } = this.props;
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
            <div className="card mx-auto w-100 comments">
              <div className="card-block">
                <div className="panel panel-white post">
                  <div className="post-footer">

                    <form onSubmit={actionMethods.createComment}>
                      <div className="input-group">
                        <input className="form-control" name="text" placeholder="Add a comment" required type="text" />
                        <span className="input-group-addon">
                          <button type="submit" disabled={repairStore.isLoading} className="btn btn-primary btn-sm">Comment</button>
                        </span>
                      </div>
                      <input type="hidden" name="userId" defaultValue={repair.attributes.userId} />
                      <input type="hidden" name="repairId" defaultValue={repair.id} />
                    </form>

                    <ul className="comments-list">
                      {repair.attributes.comments.map(comment => (<li className="comment" key={comment.createdAt}>
                        <a className="pull-left" href="">
                          <img className="avatar" src={`http://i.pravatar.cc/35?u=${comment.createdBy}`} alt="avatar" />
                        </a>
                        <div className="comment-body">
                          <div className="comment-heading">
                            <h4 className="user">{userStore.users[comment.createdBy] ? userStore.users[comment.createdBy].attributes.firstName : userStore.users[comment.createdBy]}</h4>
                            <h5 className="time">{moment(comment.createdAt).fromNow()}</h5>
                          </div>
                          <p>{comment.text}</p>
                        </div>
                      </li>),
                      )}
                    </ul>
                  </div>

                </div>
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
