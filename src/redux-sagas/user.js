import { call, put, takeEvery } from 'redux-saga/effects';
import callApi from 'common/helpers/http';

function* createAccountAsync(action) {
  const response = yield call(callApi, 'post', '/users', action.requestBody);
  yield put({ type: 'CREATE_ACCOUNT_RESPONSE', response });
}

function* watchCreateAccount() {
  yield takeEvery('CREATE_ACCOUNT', createAccountAsync);
}

function* loginAsync(action) {
  const response = yield call(callApi, 'post', '/auth/login', action.requestBody);
  yield put({ type: 'LOGIN_RESPONSE', response });
}

function* watchLogin() {
  yield takeEvery('LOGIN', loginAsync);
}

export default () => ([
  watchCreateAccount(),
  watchLogin(),
]);
