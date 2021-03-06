import _ from 'lodash';
import config from 'common/config/react';

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
    case 'ADD_USER_BY_ADMIN':
      return _.assign(_.cloneDeep(state), { isLoading: true, error: {}, info: '' });
    case 'ADD_USER_BY_ADMIN_RESPONSE':
      if (action.response.errors.length > 0) {
        return _.assign(_.cloneDeep(state), { isLoading: false, error: action.response.errors[0] });
      }
      return (_.merge(_.cloneDeep(state), {
        isLoading: false,
        info: 'New user account created. User will receive password in email',
        users: {
          [action.response.data[0].id]: action.response.data[0],
        },
      }));
    case 'VERIFY_ACCOUNT':
      return _.assign(_.cloneDeep(state), { isLoading: true, error: '', info: '' });
    case 'VERIFY_ACCOUNT_RESPONSE':
      if (action.response.errors.length > 0) {
        return _.merge(_.cloneDeep(state), { isLoading: false, error: action.response.errors[0] });
      }
      return (_.assign(_.cloneDeep(state), {
        isLoading: false,
        info: 'Account verified. Login to dashboard',
        userId: '',
      }));
    case 'LOGOUT':
      return _.cloneDeep(config.initialStore.user);
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
        users: {
          [action.response.includes[0].data[0].id]: action.response.includes[0].data[0],
        },
      }));
    case 'CLEAR_INFO':
      return _.assign(_.cloneDeep(state), { info: '' });
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
    case 'GET_ALL_USERS':
      return _.assign(_.cloneDeep(state), { isLoading: true, error: {}, info: '' });
    case 'GET_ALL_USERS_RESPONSE': {
      if (action.response.errors.length > 0) {
        return _.assign(_.cloneDeep(state), { isLoading: false, error: action.response.errors[0] });
      }
      const users = {};
      action.response.data.forEach((data) => {
        users[data.id] = data;
      });
      return (_.merge(_.cloneDeep(state), {
        isLoading: false,
        users,
      }));
    }
    case 'UPDATE_USER_ROLE':
    case 'UPDATE_USER':
      return _.assign(_.cloneDeep(state), { isLoading: true, error: {}, info: '' });
    case 'UPDATE_USER_ROLE_RESPONSE':
    case 'UPDATE_USER_RESPONSE': {
      if (action.response.errors.length > 0) {
        return _.merge(_.cloneDeep(state), { isLoading: false, error: action.response.errors[0] });
      }
      console.log('updated user', action.response.data);
      const updatedList = _.cloneDeep(state.users);
      updatedList[action.response.data[0].id] = action.response.data[0];
      return _.assign(_.cloneDeep(state), {
        isLoading: false, error: {}, info: 'Profile updated', users: updatedList,
      });
    }
    case 'UPDATE_USER_PASSWORD':
      return _.assign(_.cloneDeep(state), { isLoading: true, error: {}, info: '' });
    case 'UPDATE_USER_PASSWORD_RESPONSE': {
      if (action.response.errors.length > 0) {
        return _.merge(_.cloneDeep(state), { isLoading: false, error: action.response.errors[0] });
      }
      console.log('updated user password', action.response.data);
      return _.assign(_.cloneDeep(state), {
        isLoading: false, error: {}, info: 'Password updated',
      });
    }
    case 'DELETE_USER':
      return _.assign(_.cloneDeep(state), { isLoading: true, error: {}, info: '' });
    case 'DELETE_USER_RESPONSE': {
      if ((action.response.errors || []).length > 0) {
        return _.merge(_.cloneDeep(state), { isLoading: false, error: action.response.errors[0] });
      }
      console.log('delete user', action.response.data);
      return _.assign(_.cloneDeep(state), {
        isLoading: false, error: {}, info: '', users: _.omit(state.users, action.response.userId),
      });
    }

    default:
      return state;
  }
}

export default userReducer;
