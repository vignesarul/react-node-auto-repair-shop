import React from 'react';
import PropTypes from 'prop-types';
import AlertMessage from 'components/alert-box/alert-box-display';

class CreateUser extends React.Component {
  componentWillReceiveProps(props) {
    if (props.info) {
      this.props.history.push('/auth/verify-account');
    }
  }
  render() {
    return (<div className="py-5">
      <div className="container">
        <div className="row mx-auto w-100">
          <div className="col-12 col-lg-5 col-xl-5 mx-auto col-md-8 align-self-center">
            <div className="card mx-auto w-100">
              <div className="card-header">Create Account</div>
              {(this.props.info || this.props.error) ? <AlertMessage message={this.props} /> : ''}
              <div className="card-block">
                <form className="" onSubmit={this.props.createAccount}>
                  <div className="form-group">
                    <label htmlFor="firstName">Name</label>
                    <input type="text" name="firstName" className="form-control" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" name="email" className="form-control" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" className="form-control" />
                  </div>
                  <button type="submit" disabled={this.props.isLoading} className="btn btn-primary">Login</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
  }
}

CreateUser.propTypes = {
  info: PropTypes.string,
  error: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  createAccount: PropTypes.func.isRequired,
};

CreateUser.defaultProps = {
  error: '',
  info: '',
};

export default CreateUser;
