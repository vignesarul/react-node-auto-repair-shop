import { all } from 'redux-saga/effects';
import userSagas from 'redux-sagas/user';

export default function* rootSaga() {
  yield all(userSagas());
}
