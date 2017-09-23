import React from 'react';
import PropTypes from 'prop-types';
import Sidebar from 'components/sidebar/sidebar-container';
import AlertMessage from 'components/alert-box/alert-box-display';

class AddUser extends React.Component {
  componentWillMount() {
    if (this.props.info) {
      this.props.clearInfo();
    }
  }

  componentDidUpdate() {
    if (this.props.info) {
      this.props.history.push('/users');
    }
  }

  render() {
    return (<div className="py-5">
      <div className="container">
        <div className="row">
          <Sidebar userId={this.props.user.id} />
          <div className="col-md-9">
            <div className="card mx-auto w-100">

              <div className="card-header">Add User</div>
              {(this.props.info || this.props.error) ? <AlertMessage message={this.props} /> : ''}
              <div className="card-block">

                <form onSubmit={this.props.createNewUser}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" required className="form-control" autoComplete="new-password" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" required className="form-control" autoComplete="new-password" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" required className="form-control" autoComplete="new-password" />
                  </div>
                  <button type="submit" disabled={this.props.isLoading} className="btn btn-primary">Create User</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
  }
}

AddUser.propTypes = {
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
  isLoading: PropTypes.bool.isRequired,
  createNewUser: PropTypes.func.isRequired,
};

AddUser.defaultProps = {
  user: {},
  error: {},
  info: '',
};

export default AddUser;
