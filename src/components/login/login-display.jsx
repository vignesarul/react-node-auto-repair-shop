import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import AlertMessage from 'components/alert-box/alert-box-display';

class Login extends React.Component {
  componentWillReceiveProps(props) {
    if ((props.user || {}).id) {
      this.props.history.push(`/users/${props.user.id}/repairs?userId=${props.user.id}`);
    }
  }

  render() {
    return (<div className="py-5">
      <div className="container">
        <div className="row mx-auto w-100">
          <div className="col-12 col-lg-5 col-xl-5 mx-auto col-md-8 align-self-center">
            <div className="card mx-auto w-100">

              <div className="card-header">Login</div>
              {(this.props.info || this.props.error) ? <AlertMessage message={this.props} /> : ''}
              <div className="card-block">

                <form onSubmit={this.props.performLogin}>
                  <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" name="email" required className="form-control" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" required className="form-control" />
                  </div>
                  <button type="submit" disabled={this.props.isLoading} className="btn btn-primary">Login</button>
                </form>
                <br />
                <Link to="/auth/create-account" className="btn btn-link btn-sm">Create Account</Link>
                <Link to="/auth/forgot-password" className="btn btn-link btn-sm">Forgot Password</Link>
                <Link to="/auth/reset-password" className="btn btn-link btn-sm">Reset Password</Link>
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
