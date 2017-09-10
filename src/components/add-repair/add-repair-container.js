import { connect } from 'react-redux';
import AddRepair from 'components/add-repair/add-repair-display';
import _ from 'lodash';

// Map Redux state to component props
function mapStateToProps(state) {
  return _.merge(_.cloneDeep(state).repair, _.pick(state.user, 'user'));
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
  return {
    createNewRepair: (e) => {
      e.preventDefault();
      console.log(e.target);
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
  };
}

// Connected Component
const AddRepairContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddRepair);

export default AddRepairContainer;
