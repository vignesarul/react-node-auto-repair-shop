import { call, put, takeEvery, select } from 'redux-saga/effects';
import callApi from 'common/helpers/http';

const getToken = state => state.user.token;

function* getRepairsAsync(action) {
  const token = yield select(getToken);
  const response = yield call(callApi, 'get', `/users/${action.requestBody.userId}/repairs`, { headers: {
    authorization: token,
  } });
  yield put({ type: 'GET_REPAIRS_RESPONSE', response });
}

function* watchGetRepairs() {
  yield takeEvery('GET_REPAIRS', getRepairsAsync);
}

export default () => ([
  watchGetRepairs(),
]);
