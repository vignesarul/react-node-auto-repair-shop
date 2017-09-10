import { connect } from 'react-redux';
import CreateUser from 'components/create-user/create-user-display';

// Map Redux state to component props
function mapStateToProps(state) {
  return state.user;
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
  return {
    createAccount: (e) => {
      e.preventDefault();
      const requestBody = {
        firstName: e.target.firstName.value,
        lastName: e.target.firstName.value,
        email: e.target.email.value,
        password: e.target.password.value,
      };
      dispatch({ type: 'CREATE_ACCOUNT', requestBody });
    },
  };
}

// Connected Component
const CreateUserContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateUser);

export default CreateUserContainer;
