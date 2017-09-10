import { connect } from 'react-redux';
import ListRepairs from 'components/list-repairs/list-repairs-display';
import _ from 'lodash';

// Map Redux state to component props
function mapStateToProps(state) {
  return _.cloneDeep(state).repair;
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
  return {
    retriveRepairs: (userId) => {
      const requestBody = {
        userId,
      };
      dispatch({ type: 'GET_REPAIRS', requestBody });
    },
  };
}

// Connected Component
const ListRepairsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListRepairs);

export default ListRepairsContainer;
