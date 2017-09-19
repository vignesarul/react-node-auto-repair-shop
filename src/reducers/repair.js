import _ from 'lodash';
import config from 'common/config/react';
// Reducer

function repairReducer(state = null, action) {
  switch (action.type) {
    case 'GET_REPAIRS':
    case 'QUERY_REPAIRS':
      return _.assign(_.cloneDeep(state), { isLoading: true, error: {}, info: '' });
    case 'GET_REPAIRS_RESPONSE':
    case 'QUERY_REPAIRS_RESPONSE':
      if (action.response.errors.length > 0) {
        return _.merge(_.cloneDeep(state), { isLoading: false, error: action.response.errors[0], repairsList: [] });
      }
      return (_.assign(_.cloneDeep(state), {
        isLoading: false,
        error: {},
        repairsList: _.isEmpty(action.response.data) ? null : action.response.data,
      }));
    case 'CLEAR_INFO':
      return _.assign(_.cloneDeep(state), { info: '' });
    case 'ADD_REPAIR':
      return _.assign(_.cloneDeep(state), { isLoading: true, error: {}, info: '' });
    case 'ADD_REPAIR_RESPONSE':
      if (action.response.errors.length > 0) {
        return _.merge(_.cloneDeep(state), { isLoading: false, error: action.response.errors[0] });
      }
      console.log('added repair', action.response.data);
      return _.assign(_.cloneDeep(state), {
        isLoading: false,
        error: {},
        info: 'Meal Added successfully',
        repairsList: action.response.data.concat(state.repairsList),
      });
    case 'UPDATE_REPAIR_BY_ADMIN':
    case 'ADD_COMMENT':
      return _.assign(_.cloneDeep(state), { isLoading: true, error: {}, info: '' });
    case 'ADD_COMMENT_RESPONSE':
    case 'UPDATE_REPAIR_BY_ADMIN_RESPONSE': {
      if (action.response.errors.length > 0) {
        return _.merge(_.cloneDeep(state), { isLoading: false, error: action.response.errors[0] });
      }
      console.log('updated repair', action.response.data);
      const updatedList = _.cloneDeep(state.repairsList);
      updatedList[_.findIndex(updatedList, { id: action.response.data[0].id })] = action.response.data[0];
      return _.assign(_.cloneDeep(state), {
        isLoading: false, error: {}, info: 'Repair Updated Successfully', repairsList: updatedList,
      });
    }
    case 'UPDATE_REPAIR_BY_USER':
      return _.assign(_.cloneDeep(state), { isLoading: true, error: {}, info: '' });
    case 'UPDATE_REPAIR_BY_USER_RESPONSE': {
      if (action.response.errors.length > 0) {
        return _.merge(_.cloneDeep(state), { isLoading: false, error: action.response.errors[0] });
      }
      console.log('updated repair', action.response.data);
      const updatedList = _.cloneDeep(state.repairsList);
      updatedList[_.findIndex(updatedList, { id: action.response.data[0].id })] = action.response.data[0];
      return _.assign(_.cloneDeep(state), {
        isLoading: false, error: {}, info: '', repairsList: updatedList,
      });
    }
    case 'DELETE_REPAIR':
      return _.assign(_.cloneDeep(state), { isLoading: true, error: {}, info: '' });
    case 'DELETE_REPAIR_RESPONSE': {
      if ((action.response.errors || []).length > 0) {
        return _.merge(_.cloneDeep(state), { isLoading: false, error: action.response.errors[0] });
      }
      console.log('deleted repair', action.response.data);
      const updatedList = _.cloneDeep(state.repairsList);
      _.remove(updatedList, { id: action.response.repairId });
      return _.assign(_.cloneDeep(state), {
        isLoading: false, error: {}, info: '', repairsList: updatedList,
      });
    }
    case 'LOGOUT':
      return _.cloneDeep(config.initialStore.repair);
    default:
      return state;
  }
}

export default repairReducer;
