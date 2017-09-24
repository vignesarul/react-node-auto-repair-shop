import React from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import PropTypes from 'prop-types';
import AlertMessage from 'components/alert-box/alert-box-display';

class CreateUser extends React.Component {
  componentWillReceiveProps(props) {
    if (props.info) {
      this.props.history.push('/auth/verify-account');
    }
  }
  render() {
    let errorParam;
    if (!_.isEmpty(this.props.error)) {
      errorParam = (this.props.error.source || {}).parameter || '';
    }
    return (<div className="py-5">
      <div className="container">
        <div className="row mx-auto w-100">
          <div className="col-12 col-lg-5 col-xl-5 mx-auto col-md-8 align-self-center">
            <div className="card mx-auto w-100">
              <div className="card-header">Create Account</div>
              {(this.props.info || this.props.error) ? <AlertMessage message={this.props} /> : ''}
              <div className="card-block">
                <form className="" onSubmit={this.props.createAccount}>
                  <div className={`form-group ${errorParam && errorParam === 'firstName' ? 'has-danger' : ''}`}>
                    <label htmlFor="firstName">Name</label>
                    <input type="text" name="firstName" required className={`form-control ${errorParam && errorParam === 'firstName' ? 'form-control-danger' : ''}`} />
                  </div>
                  <div className={`form-group ${errorParam && errorParam === 'email' ? 'has-danger' : ''}`}>
                    <label htmlFor="email">Email address</label>
                    <input type="email" name="email" required className={`form-control ${errorParam && errorParam === 'email' ? 'form-control-danger' : ''}`} autoComplete="new-password" />
                  </div>
                  <div className={`form-group ${errorParam && errorParam === 'password' ? 'has-danger' : ''}`}>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" required className={`form-control ${errorParam && errorParam === 'password' ? 'form-control-danger' : ''}`} autoComplete="new-password" />
                  </div>
                  <button type="submit" disabled={this.props.isLoading} className="btn btn-primary">Signup</button>
                </form>
                <br />
                <Link to="/auth/login" className="btn btn-link btn-sm">Login</Link>
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
