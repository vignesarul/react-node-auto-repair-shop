import { connect } from 'react-redux';
import EditRepair from 'components/edit-repair/edit-repair-display';
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
      editRepair: (e) => {
        e.preventDefault();
        const requestBody = {
          title: e.target.title.value,
          repairId: e.target.id.value,
          approved: Boolean(e.target.status.value === 'approved'),
          completed: Boolean(e.target.status.value === 'completed'),
          date: e.target.date.value,
          time: e.target.time.value,
          userId: e.target.userId.value,
          repairOwnerId: e.target.repairOwnerId.value,
        };
        dispatch({ type: 'UPDATE_REPAIR_BY_ADMIN', requestBody });
      },
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
const EditRepairContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditRepair);

export default EditRepairContainer;
