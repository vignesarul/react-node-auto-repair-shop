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
      createComment: (e) => {
        e.preventDefault();
        const requestBody = {
          userId: e.target.userId.value,
          repairId: e.target.repairId.value,
          comments: [{ text: e.target.text.value }],
        };
        e.target.text.value = '';
        dispatch({ type: 'ADD_COMMENT', requestBody });
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
