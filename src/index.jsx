import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import rootReducer from 'reducers';
import Routes from 'routes';
import createSagaMiddleware from 'redux-saga';
import rootSaga from 'redux-sagas';
import registerServiceWorker from './registerServiceWorker';

registerServiceWorker();
const sagaMiddleware = createSagaMiddleware();

const updateFromLocalStorage = (defaultState) => {
  const localState = localStorage.getItem('state');
  return localState ? JSON.parse(localState) : defaultState;
};

// Intial storedata
const initialStore = updateFromLocalStorage({
  error: '',
  info: '',
  isLoading: false,
});

// Store
const store = createStore(rootReducer, initialStore, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);

const App = () => (<Provider store={store}>
  <BrowserRouter>
    <Routes />
  </BrowserRouter>
</Provider>);

ReactDOM.render(<App />, document.getElementById('root'));
