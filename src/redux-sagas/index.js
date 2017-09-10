import { all } from 'redux-saga/effects';
import userSagas from 'redux-sagas/user';
import repairSagas from 'redux-sagas/repair';

export default function* rootSaga() {
  yield all([].concat(userSagas(), repairSagas()));
}
