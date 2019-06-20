
import { combineReducers } from 'redux-immutable';
import { compose } from 'redux';

import { connectRouter } from 'connected-react-router/immutable';

import { reducer as form } from 'redux-form/immutable';
import { GenericReducer, InjectedReducers } from './Interfaces';
import { History } from 'history';

const reducerConfig: {
  history?: History,
} = {};

export function configureReducer({
  history,
}: {
  history?: History;
}) {
  if (history != null) {
    reducerConfig.history = history;
  }
}

export default function createReducer(injectedReducers?: InjectedReducers) {
  const composedReducers = [
    (reducers: any) => reducers,
  ];

  const combinedReducers = {
    ...reducerConfig.history != null
      ? {
          router: connectRouter(reducerConfig.history),
        }
      : {},
    form,
    ...injectedReducers,
  };

  return compose<GenericReducer>(
    ...composedReducers
  )(
    combineReducers(combinedReducers)
  );
}
