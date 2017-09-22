import { connect } from 'react-redux';
import VerifyAccount from 'components/verify-account/verify-account-display';
import _ from 'lodash';

// Map Redux state to component props
function mapStateToProps(state) {
  return _.cloneDeep(state).user;
}


// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
  return {
    verifyAccount: (e) => {
      e.preventDefault();
      const requestBody = {
        userId: e.target.userId.value,
        code: e.target.code.value,
      };
      dispatch({ type: 'VERIFY_ACCOUNT', requestBody });
    },
  };
}

// Connected Component
const VerifyAccountContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(VerifyAccount);

export default VerifyAccountContainer;
