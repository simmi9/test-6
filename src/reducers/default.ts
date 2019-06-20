import {
  fromJS,
  List,
  Record,
} from 'immutable';
import {
  IAction,
} from '../Interfaces';

import {
  DefaultActionTypes,
  ITodo,
  AddTodoAction,
  IUser,
  AddUserAction,
  UserFactory,
  TodoFactory,
} from '../actions/default';

// import {
//   Settings,
// } from '../../models';

export interface IReducerState {
  lastUserId: number;
  users: Map<number, Record<IUser>>;
  todos: Map<number, List<Record<ITodo>>>;
}

const INITIAL_STATE = fromJS({
  lastUserId: 4,
  users: {
    1: UserFactory({
      name: 'Ryan',
    }),
    2: UserFactory({
      name: 'Sandy',
    }),
    3: UserFactory({
      name: 'Sean',
    }),
    4: UserFactory({
      name: 'Peter',
    }),
  },
  todos: {
    1: List([
      TodoFactory({
        title: 'Drink Water',
      }),
    ]),
  },
});

export const reducer = (state: Record<IReducerState> = INITIAL_STATE, action: IAction) => {
  switch (action.type) {
    case DefaultActionTypes.ADD_USER: {
      const lastUserId = state.get('lastUserId');
      const {
        payload,
      } = action as AddUserAction;
      const {
        user,
      } = payload;

      const userId = lastUserId + 1;
      return state.withMutations((mutableState) => {
        mutableState.set('lastUserId', userId);
        mutableState.setIn(
          ['users', userId],
          user,
        );
      })
    }
    case DefaultActionTypes.ADD_TODO: {
      const {
        payload,
      } = action as AddTodoAction;
      const {
        userId,
        todo,
      } = payload;
      return state.updateIn(
        ['todos', userId],
        (todoListForUser?: List<Record<ITodo>>) => {
          return (todoListForUser || List<Record<ITodo>>()).push(
            todo,
          );
        }
      );
    }
    default:
      return state;
  }
};

export default reducer;
