import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter } from 'react-router-dom';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import { Provider } from 'react-redux';
import rootReducer from 'reducers';
import Routes from 'routes';
import createSagaMiddleware from 'redux-saga';
import rootSaga from 'redux-sagas';
import registerServiceWorker from 'registerServiceWorker';
import config from 'common/config/react';

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
/* eslint-enable */
registerServiceWorker();
const sagaMiddleware = createSagaMiddleware();

// Intial storedata
const initialStore = config.initialStore;

const persistConfig = {
  key: 'root', // key is required
  storage, // storage is now required
};

const reducer = persistReducer(persistConfig, rootReducer);

// Store
const store = createStore(reducer, initialStore, composeEnhancers(applyMiddleware(sagaMiddleware)));
const initApp = () => {
  const App = () => (<Provider store={store}>
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  </Provider>);

  ReactDOM.render(<App />, document.getElementById('root'));
};

persistStore(store, {}, () => initApp());
sagaMiddleware.run(rootSaga);
