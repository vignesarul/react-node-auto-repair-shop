import { connect } from 'react-redux';
import AddRepair from 'components/add-user/add-user-display';
import _ from 'lodash';

// Map Redux state to component props
function mapStateToProps(state) {
  return _.cloneDeep(state).user;
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
  return {
    createNewUser: (e) => {
      e.preventDefault();
      const requestBody = {
        firstName: e.target.name.value,
        lastName: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value,
      };
      dispatch({ type: 'ADD_USER_BY_ADMIN', requestBody });
    },
    clearInfo: () => {
      dispatch({ type: 'CLEAR_INFO' });
    },
  };
}

// Connected Component
const AddUserContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddRepair);

export default AddUserContainer;
