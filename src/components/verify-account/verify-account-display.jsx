import React from 'react';
import PropTypes from 'prop-types';
import AlertMessage from 'components/alert-box/alert-box-display';

class VerifyAccount extends React.Component {
  componentWillReceiveProps(props) {
    if (!props.userId) {
      this.props.history.push('/auth/login');
    }
  }
  render() {
    return (<div className="py-5">
      <div className="container">
        <div className="row mx-auto w-100">
          <div className="col-12 col-lg-5 col-xl-5 mx-auto col-md-8 align-self-center">
            <div className="card mx-auto w-100">
              <div className="card-header">Verify Email</div>
              {(this.props.info || this.props.error) ? <AlertMessage message={this.props} /> : ''}
              <div className="card-block">
                <form onSubmit={this.props.verifyAccount}>
                  <input type="hidden" name="userId" value={this.props.userId} />
                  <div className="form-group">
                    <label htmlFor="code">Verification code</label>
                    <input type="text" name="code" required className="form-control" />
                  </div>
                  <button type="submit" disabled={this.props.isLoading} className="btn btn-primary">Verify Email</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
  }
}

VerifyAccount.propTypes = {
  info: PropTypes.string,
  error: PropTypes.string,
  userId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  verifyAccount: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

VerifyAccount.defaultProps = {
  error: '',
  info: '',
};


export default VerifyAccount;
