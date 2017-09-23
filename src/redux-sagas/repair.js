import { call, put, takeEvery, select } from 'redux-saga/effects';
import callApi from 'common/helpers/http';
import _ from 'lodash';

const getToken = state => state.user.token;

function* getRepairsAsync(action) {
  const token = yield select(getToken);
  let query = `?filter=${action.requestBody.filter || ''}`;
  if (!_.isEmpty(action.requestBody.next)) query = action.requestBody.next;
  const response = yield call(callApi, 'get', `/users/${action.requestBody.userId}/repairs${query}`,
    { headers: { authorization: token } });
  yield put({ type: 'GET_REPAIRS_RESPONSE', response });
}

function* watchGetRepairs() {
  yield takeEvery('GET_REPAIRS', getRepairsAsync);
}

function* queryRepairsAsync(action) {
  const token = yield select(getToken);
  let query = `?filter=${action.requestBody.filter || ''}`;
  if (!_.isEmpty(action.requestBody.next)) query = action.requestBody.next;
  const response = yield call(callApi, 'get', `/repairs${query}`, { headers: {
    authorization: token,
  } });
  yield put({ type: 'QUERY_REPAIRS_RESPONSE', response });
}

function* watchQueryRepairs() {
  yield takeEvery('QUERY_REPAIRS', queryRepairsAsync);
}

function* addRepairAsync(action) {
  const token = yield select(getToken);
  const response = yield call(callApi, 'post', `/users/${action.requestBody.userId}/repairs`,
    _.omit(action.requestBody, 'userId'), { headers: {
      authorization: token,
    } });
  yield put({ type: 'ADD_REPAIR_RESPONSE', response });
}

function* watchAddRepair() {
  yield takeEvery('ADD_REPAIR', addRepairAsync);
}

function* updateRepairByAdminAsync(action) {
  const token = yield select(getToken);
  const response = yield call(callApi, 'put', `/users/${action.requestBody.repairOwnerId || action.requestBody.userId}/repairs/${action.requestBody.repairId}/manage`, action.requestBody, { headers: {
    authorization: token,
  } });
  yield put({ type: 'UPDATE_REPAIR_BY_ADMIN_RESPONSE', response });
}

function* watchUpdateByAdminRepair() {
  yield takeEvery('UPDATE_REPAIR_BY_ADMIN', updateRepairByAdminAsync);
}

function* updateRepairByUserAsync(action) {
  const token = yield select(getToken);
  const response = yield call(callApi, 'put', `/users/${action.requestBody.userId}/repairs/${action.requestBody.repairId}`, action.requestBody, { headers: {
    authorization: token,
  } });
  yield put({ type: 'UPDATE_REPAIR_BY_USER_RESPONSE', response });
}

function* watchUpdateByUserRepair() {
  yield takeEvery('UPDATE_REPAIR_BY_USER', updateRepairByUserAsync);
}

function* createCommentAsync(action) {
  const token = yield select(getToken);
  const response = yield call(callApi, 'post', `/users/${action.requestBody.userId}/repairs/${action.requestBody.repairId}/comment`, action.requestBody, { headers: {
    authorization: token,
  } });
  yield put({ type: 'ADD_COMMENT_RESPONSE', response });
}

function* watchCreateComment() {
  yield takeEvery('ADD_COMMENT', createCommentAsync);
}

function* deleteRepairAsync(action) {
  const token = yield select(getToken);
  const response = yield call(callApi, 'delete', `/users/${action.requestBody.userId}/repairs/${action.requestBody.repairId}`, { headers: {
    authorization: token,
  } });
  yield put({ type: 'DELETE_REPAIR_RESPONSE',
    response: _.merge(response, {
      repairId: action.requestBody.repairId,
    }) });
}

function* watchDeleteRepair() {
  yield takeEvery('DELETE_REPAIR', deleteRepairAsync);
}

export default () => ([
  watchGetRepairs(),
  watchAddRepair(),
  watchUpdateByAdminRepair(),
  watchUpdateByUserRepair(),
  watchDeleteRepair(),
  watchQueryRepairs(),
  watchCreateComment(),
]);
