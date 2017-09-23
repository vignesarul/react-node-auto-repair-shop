import { call, put, takeEvery, select } from 'redux-saga/effects';
import _ from 'lodash';
import callApi from 'common/helpers/http';

const getToken = state => state.user.token;

function* createAccountAsync(action) {
  const response = yield call(callApi, 'post', '/users', action.requestBody);
  yield put({ type: 'CREATE_ACCOUNT_RESPONSE', response });
}

function* watchCreateAccount() {
  yield takeEvery('CREATE_ACCOUNT', createAccountAsync);
}

function* addUserByAdminAsync(action) {
  const token = yield select(getToken);
  const response = yield call(callApi, 'post', '/users', action.requestBody, { headers: {
    authorization: token,
  } });
  yield put({ type: 'ADD_USER_BY_ADMIN_RESPONSE', response });
}

function* watchAddUserAccount() {
  yield takeEvery('ADD_USER_BY_ADMIN', addUserByAdminAsync);
}

function* verifyAccountAsync(action) {
  const response = yield call(callApi, 'put', `/users/${action.requestBody.userId}/activate`,
    _.omit(action.requestBody, 'userId'),
  );
  yield put({ type: 'VERIFY_ACCOUNT_RESPONSE', response });
}

function* watchVerifyAccount() {
  yield takeEvery('VERIFY_ACCOUNT', verifyAccountAsync);
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

function* updateUserAsync(action) {
  const token = yield select(getToken);
  const response = yield call(callApi, 'put', `/users/${action.requestBody.userId}`, action.requestBody, { headers: {
    authorization: token,
  } });
  yield put({ type: 'UPDATE_USER_RESPONSE', response });
}

function* watchUpdateUser() {
  yield takeEvery('UPDATE_USER', updateUserAsync);
}

function* updateUserPasswordAsync(action) {
  const token = yield select(getToken);
  const response = yield call(callApi, 'put', `/users/${action.requestBody.userId}/password`, action.requestBody, { headers: {
    authorization: token,
  } });
  yield put({ type: 'UPDATE_USER_PASSWORD_RESPONSE', response });
}

function* watchUpdateUserPassword() {
  yield takeEvery('UPDATE_USER_PASSWORD', updateUserPasswordAsync);
}

function* deleteUserAsync(action) {
  const token = yield select(getToken);
  const response = yield call(callApi, 'delete', `/users/${action.requestBody.userId}`, { headers: {
    authorization: token,
  } });
  yield put({ type: 'DELETE_USER_RESPONSE',
    response: _.merge(response, {
      userId: action.requestBody.userId,
    }) });
}

function* watchDeleteUser() {
  yield takeEvery('DELETE_USER', deleteUserAsync);
}

export default () => ([
  watchCreateAccount(),
  watchAddUserAccount(),
  watchVerifyAccount(),
  watchLogin(),
  watchGetUser(),
  watchGetAllUsers(),
  watchUpdateUser(),
  watchUpdateUserPassword(),
  watchDeleteUser(),
]);
