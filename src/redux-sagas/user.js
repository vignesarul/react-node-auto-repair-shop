import { call, put, takeEvery, select } from 'redux-saga/effects';
import callApi from 'common/helpers/http';

const getToken = state => state.user.token;

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

function* getUserAsync(action) {
  const token = yield select(getToken);
  const response = yield call(callApi, 'get', `/users/${action.requestBody.userId}`, { headers: {
    authorization: token,
  } });
  yield put({ type: 'GET_USER_RESPONSE', response });
}

function* watchGetUser() {
  yield takeEvery('GET_USER', getUserAsync);
}

function* getAllUsersAsync() {
  const token = yield select(getToken);
  const response = yield call(callApi, 'get', '/users', { headers: {
    authorization: token,
  } });
  yield put({ type: 'GET_ALL_USERS_RESPONSE', response });
}

function* watchGetAllUsers() {
  yield takeEvery('GET_ALL_USERS', getAllUsersAsync);
}

export default () => ([
  watchCreateAccount(),
  watchLogin(),
  watchGetUser(),
  watchGetAllUsers(),
]);
