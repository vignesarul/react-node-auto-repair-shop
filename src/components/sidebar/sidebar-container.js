import { connect } from 'react-redux';
import _ from 'lodash';
import SideBar from 'components/sidebar/sidebar-display';

// Action
// const increaseAction = { type: 'increase' }

// Map Redux state to component props
function mapStateToProps(store) {
  const { repair, user } = _.cloneDeep(store);
  return {
    repairStore: repair,
    userStore: user,
  };
}

// Map Redux actions to component props
function mapDispatchToProps() {
  return {
    // onIncreaseClick: () => dispatch(increaseAction)
  };
}

// Connected Component
const SideBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SideBar);

export default SideBarContainer;
