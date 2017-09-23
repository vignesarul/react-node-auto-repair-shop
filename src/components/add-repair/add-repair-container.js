import { connect } from 'react-redux';
import AddRepair from 'components/add-repair/add-repair-display';
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
      createNewRepair: (e) => {
        e.preventDefault();
        const requestBody = {
          title: e.target.title.value,
          approved: Boolean(e.target.status.value === 'approved'),
          completed: Boolean(e.target.status.value === 'completed'),
          date: e.target.date.value,
          time: e.target.time.value,
          userId: e.target.userId.value,
        };
        dispatch({ type: 'ADD_REPAIR', requestBody });
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
const AddRepairContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddRepair);

export default AddRepairContainer;
