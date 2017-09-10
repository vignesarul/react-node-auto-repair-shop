import React from 'react';
import PropTypes from 'prop-types';
import Sidebar from 'components/sidebar/sidebar-container';
import AlertMessage from 'components/alert-box/alert-box-display';

class AddRepair extends React.Component {
  componentWillMount() {
    if (this.props.info) {
      this.props.clearInfo();
    }
  }

  componentDidUpdate() {
    if (this.props.info) {
      this.props.history.push(`/users/${this.props.user.id}/repairs`);
    }
  }

  render() {
    return (<div className="py-5">
      <div className="container">
        <div className="row">
          <Sidebar userId={this.props.user.id} />
          <div className="col-md-9">
            <div className="card mx-auto w-100">

              <div className="card-header">Add Repair</div>
              {(this.props.info || this.props.error) ? <AlertMessage message={this.props} /> : ''}
              <div className="card-block">

                <form onSubmit={this.props.createNewRepair}>
                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" className="form-control" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="userId">User Id</label>
                    <input
                      type="text"
                      name="userId"
                      defaultValue={this.props.match.params.userId}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input type="date" name="date" className="form-control" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="time">Time</label>
                    <input
                      type="text"
                      pattern="^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]:[0-5][0-9]$"
                      name="time"
                      className="form-control"
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
                  <button type="submit" disabled={this.props.isLoading} className="btn btn-primary">Add Repair</button>
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
  user: PropTypes.shape({
    id: PropTypes.string,
  }),
  info: PropTypes.string,
  error: PropTypes.shape({
    code: PropTypes.string,
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  clearInfo: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string,
    }),
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  createNewRepair: PropTypes.func.isRequired,
};

AddRepair.defaultProps = {
  user: {},
  error: {},
  info: '',
};

export default AddRepair;
