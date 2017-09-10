import _ from 'lodash';
// Reducer

function repairReducer(state = null, action) {
  switch (action.type) {
    case 'GET_REPAIRS':
      return _.assign(_.cloneDeep(state), { isLoading: true, error: {}, info: '' });
    case 'GET_REPAIRS_RESPONSE':
      if (action.response.errors.length > 0) {
        return _.merge(_.cloneDeep(state), { isLoading: false, error: action.response.errors[0], repairsList: null });
      }
      console.log('statein reqducer', state);
      return (_.assign(_.cloneDeep(state), {
        isLoading: false,
        error: {},
        repairsList: _.isEmpty(action.response.data) ? null : action.response.data,
      }));
    default:
      return state;
  }
}

export default repairReducer;
