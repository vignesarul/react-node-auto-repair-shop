import { connect } from 'react-redux';
import EditUser from 'components/edit-user/edit-user-display';
import _ from 'lodash';

// Map Redux state to component props
function mapStateToProps(store) {
  const { repair, user } = _.cloneDeep(store);
  return {
    repairStore: repair,
    userStore: user,
  };
  // return _.merge(_.cloneDeep(state).repair, _.pick(state.user, 'user'));
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
  return {
    actionMethods: {
      EditUser: (e) => {
        e.preventDefault();
        const requestBody = {
          firstName: e.target.firstName.value,
          email: e.target.email.value,
          userId: e.target.userId.value,
        };
        dispatch({ type: 'UPDATE_USER', requestBody });
      },
      updatePassword: (e) => {
        e.preventDefault();
        const requestBody = {
          old: e.target.old.value,
          new: e.target.new.value,
          userId: e.target.userId.value,
        };
        dispatch({ type: 'UPDATE_USER_PASSWORD', requestBody });
      },
      updateRole: (e) => {
        e.preventDefault();
        const requestBody = {
          roles: e.target.role.value,
          userId: e.target.userId.value,
        };
        dispatch({ type: 'UPDATE_USER_ROLE', requestBody });
      },
      clearInfo: () => {
        dispatch({ type: 'CLEAR_INFO' });
      },
    },
  };
}

// Connected Component
const EditUserContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditUser);

export default EditUserContainer;
