import _ from 'lodash';
// Reducer

function repairReducer(state = null, action) {
  switch (action.type) {
    case 'GET_REPAIRS':
      return _.assign(_.cloneDeep(state), { isLoading: true, error: {}, info: '' });
    case 'GET_REPAIRS_RESPONSE':
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
      return _.assign(_.cloneDeep(state), { isLoading: true, error: {}, info: '' });
    case 'UPDATE_REPAIR_BY_ADMIN_RESPONSE': {
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
    default:
      return state;
  }
}

export default repairReducer;
