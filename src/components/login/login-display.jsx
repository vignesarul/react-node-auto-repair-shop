import React from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import PropTypes from 'prop-types';
import AlertMessage from 'components/alert-box/alert-box-display';

class Login extends React.Component {
  componentWillReceiveProps(props) {
    if ((props.user || {}).id) {
      this.props.history.push(`/users/${props.user.id}/repairs?userId=${props.user.id}`);
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

              <div className="card-header">Login</div>
              {(this.props.info || this.props.error) ? <AlertMessage message={this.props} /> : ''}
              <div className="card-block">

                <form onSubmit={this.props.performLogin}>
                  <div className={`form-group ${errorParam && errorParam === 'email' ? 'has-danger' : ''}`}>
                    <label htmlFor="email">Email address</label>
                    <input type="email" name="email" required className={`form-control ${errorParam && errorParam === 'email' ? 'form-control-danger' : ''}`} />
                  </div>
                  <div className={`form-group ${errorParam && errorParam === 'password' ? 'has-danger' : ''}`}>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" required className={`form-control ${errorParam && errorParam === 'password' ? 'form-control-danger' : ''}`} />
                  </div>
                  <button type="submit" disabled={this.props.isLoading} className="btn btn-primary">Login</button>
                </form>
                <br />
                <Link to="/auth/create-account" className="btn btn-link btn-sm">Create Account</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
  }
}

Login.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
  }),
  info: PropTypes.string,
  error: PropTypes.shape({
    code: PropTypes.string,
    source: PropTypes.shape(),
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  performLogin: PropTypes.func.isRequired,
};

Login.defaultProps = {
  user: {},
  error: {},
  info: '',
};

export default Login;
