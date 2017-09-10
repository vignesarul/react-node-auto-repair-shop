import { connect } from 'react-redux';
import Login from 'components/login/login-display';
import _ from 'lodash';

// Map Redux state to component props
function mapStateToProps(state) {
  return _.cloneDeep(state).user;
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
  return {
    performLogin: (e) => {
      e.preventDefault();
      const requestBody = {
        email: e.target.email.value,
        password: e.target.password.value,
      };
      dispatch({ type: 'LOGIN', requestBody });
    },
  };
}

// Connected Component
const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);

export default LoginContainer;
