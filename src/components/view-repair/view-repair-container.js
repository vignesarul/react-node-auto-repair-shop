import { connect } from 'react-redux';
import EditRepair from 'components/view-repair/view-repair-display';
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
      clearInfo: () => {
        dispatch({ type: 'CLEAR_INFO' });
      },
      getUsers: () => {
        dispatch({ type: 'GET_ALL_USERS' });
      },
    },
  };
}

// Connected Component
const ViewRepairContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditRepair);

export default ViewRepairContainer;
