import { call, put, takeEvery } from 'redux-saga/effects';
import callApi from 'common/helpers/http';

function* createAccountAsync(action) {
  const response = yield call(callApi, 'post', '/users', action.requestBody);
  yield put({ type: 'CREATE_ACCOUNT_RESPONSE', response });
}

function* watchCreateAccount() {
  yield takeEvery('CREATE_ACCOUNT', createAccountAsync);
}

export default () => ([
  watchCreateAccount(),
]);
