import _ from 'lodash';
// Reducer

function userReducer(state = null, action) {
  switch (action.type) {
    case 'CREATE_ACCOUNT':
      return _.assign(_.cloneDeep(state), { isLoading: true, error: {}, info: '' });
    case 'CREATE_ACCOUNT_RESPONSE':
      if (action.response.errors.length > 0) {
        return _.assign(_.cloneDeep(state), { isLoading: false, error: action.response.errors[0] });
      }
      return (_.assign(_.cloneDeep(state), {
        isLoading: false,
        info: 'Enter the verification code sent to your email',
        userId: action.response.data[0].id,
      }));
    case 'LOGIN':
      return _.assign(_.cloneDeep(state), { isLoading: true, error: {}, info: '' });
    case 'LOGIN_RESPONSE':
      if (action.response.errors.length > 0) {
        return _.assign(_.cloneDeep(state), { isLoading: false, error: action.response.errors[0] });
      }
      return (_.assign(_.cloneDeep(state), {
        isLoading: false,
        user: action.response.includes[0].data[0],
        token: action.response.data[0].attributes.access_token,
      }));
    case 'GET_USER':
      return _.assign(_.cloneDeep(state), { isLoading: true, error: {}, info: '' });
    case 'GET_USER_RESPONSE':
      if (action.response.errors.length > 0) {
        return _.assign(_.cloneDeep(state), { isLoading: false, error: action.response.errors[0] });
      }
      return (_.merge(_.cloneDeep(state), {
        isLoading: false,
        users: {
          [action.response.data[0].id]: action.response.data[0],
        },
      }));
    default:
      return state;
  }
}

export default userReducer;
