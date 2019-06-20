import {
  createSelector,
} from 'reselect';
import {
  Map,
  List,
  Record,
} from 'immutable';
import {
  IReducerState,
} from '../reducers/default';
import {
  ITodo,
  IUser,
} from '../actions/default';

export const selectReducerState = () => (state: any) => {
  const reducerState = state.get('default');
  if (reducerState != null) {
    return reducerState;
  }
  return Map();
};

export const makeSelectUsers = () => createSelector(
  selectReducerState(),
  (state: Record<IReducerState>) => state.get('users') || Map<number, Record<IUser>>(),
);

export const makeSelectTodos = () => createSelector(
  selectReducerState(),
  (state: Record<IReducerState>) => state.get('todos') || Map<number, List<Record<ITodo>>>(),
);

export const makeSelectTodosForUser = (userId: number) => createSelector(
  makeSelectTodos(),
  (todos) => todos.get(userId) || List<Record<ITodo>>(),
);

export default {
  selectReducerState,
};
