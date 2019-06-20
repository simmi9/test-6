/**
 * Create the store with dynamic reducers
 */

import {
  createStore,
  applyMiddleware,
  compose,
  Store,
  Middleware,
} from 'redux';
import Immutable, {
  fromJS,
} from 'immutable';
import {
  routerMiddleware,
} from 'connected-react-router/immutable';
import createSagaMiddleware from 'redux-saga';
import createReducer, {
  configureReducer,
} from './reducers';
import {
  GenericReducer,
  GenericSaga,
  InjectedReducers,
} from './Interfaces';
import {
  createBrowserHistory,
  History,
} from 'history';

import reduxClassActionMiddleware from './reduxClassActionMiddleware';

export const sagaMiddleware = createSagaMiddleware();

export type AtsStore<S = any> = Store<S> & {
  runSaga?: (saga: GenericSaga) => void;
  injectedReducers?: {
    [key: string]: GenericReducer;
  }
  injectedSagas?: {
    [key: string]: GenericSaga;
  }
};

interface IConfigureStoreOptions {
  initialState?: object;
  history?: History;
  reducers?: InjectedReducers;
  beforeMiddleware?: Middleware[];
  afterMiddleware?: Middleware[];
}

export default function configureStore({
  initialState = {},
  reducers,
  history = createBrowserHistory(),
  beforeMiddleware = [],
  afterMiddleware = [],
}: IConfigureStoreOptions = {}) {
  // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  const middlewares = [
    ...beforeMiddleware,
    reduxClassActionMiddleware,
    sagaMiddleware,
    routerMiddleware(history),
    ...afterMiddleware,
  ];

  configureReducer({
    history,
  });

  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        immutable: Immutable,
        shouldHotReload: false,
      }) :
      compose;

  const store: AtsStore = createStore(
    createReducer(reducers),
    fromJS(initialState),
    composeEnhancers(...enhancers)
  );

  // Extensions
  store.runSaga = sagaMiddleware.run;
  store.injectedReducers = {
    ...reducers,
  }; // Reducer registry
  store.injectedSagas = {}; // Saga registry

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if ((module as any).hot) {
    (module as any).hot.accept('./reducers', () => {
      store.replaceReducer(createReducer({...store.injectedReducers}));
    });
  }

  return store;
}
