import { combineReducers } from 'redux';
import user from 'reducers/user';
import repair from 'reducers/repair';

export default combineReducers({
  user, repair,
});
