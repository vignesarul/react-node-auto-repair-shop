import { connect } from 'react-redux';
import ListRepairs from 'components/list-repairs/list-repairs-display';
import _ from 'lodash';

// Map Redux state to component props
function mapStateToProps(state) {
  const clonedState = _.cloneDeep(state);
  return _.merge(clonedState.repair, { user: clonedState.user.user });
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
  return {
    refreshData: (e) => {
      const requestBody = {
        userId: e.target.getAttribute('data-userId'),
      };
      dispatch({ type: 'GET_REPAIRS', requestBody });
    },
    retriveRepairs: (userId) => {
      const requestBody = {
        userId,
      };
      dispatch({ type: 'GET_REPAIRS', requestBody });
    },
    markCompleted: (e) => {
      const role = e.target.getAttribute('data-role');
      const requestBody = {
        userId: e.target.getAttribute('data-userId'),
        repairId: e.target.getAttribute('data-id'),
        completed: true,
      };
      dispatch({ type: role === 'user' ? 'UPDATE_REPAIR_BY_USER' : 'UPDATE_REPAIR_BY_ADMIN', requestBody });
    },
    markApproved: (e) => {
      const requestBody = {
        userId: e.target.getAttribute('data-userId'),
        repairId: e.target.getAttribute('data-id'),
        approved: true,
      };
      dispatch({ type: 'UPDATE_REPAIR_BY_ADMIN', requestBody });
    },
  };
}

// Connected Component
const ListRepairsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListRepairs);

export default ListRepairsContainer;
