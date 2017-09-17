import { connect } from 'react-redux';
import ListUser from 'components/list-users/list-users-display';
import _ from 'lodash';

// Map Redux state to component props
function mapStateToProps(store) {
  const { repair, user } = _.cloneDeep(store);
  return {
    repairStore: repair,
    userStore: user,
  };
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
  return {
    actionMethods: {
      retriveUsers: () => {
        const requestBody = {};
        dispatch({ type: 'GET_ALL_USERS', requestBody });
      },
    },
  };
}

// Connected Component
const ListUserContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListUser);

export default ListUserContainer;
