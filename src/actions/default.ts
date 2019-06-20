import {
  IAction,
} from '../Interfaces';
import {
  Record,
} from 'immutable';

export default {};

export enum DefaultActionTypes {
  ADD_USER = 'ADD_USER',
  ADD_TODO = 'ADD_TODO',
}

export interface IUser {
  name: string;
}

export const UserFactory = Record<IUser>({
  name: '',
});

export interface ITodo {
  title: string;
}

export const TodoFactory = Record<ITodo>({
  title: 'untitled',
});

export class AddUserAction implements IAction {
  public readonly type = DefaultActionTypes.ADD_USER;
  constructor(
    public payload: {
      user: Record<IUser>,
    }
  ) {}
}

export class AddTodoAction implements IAction {
  public readonly type = DefaultActionTypes.ADD_TODO;
  constructor(
    public payload: {
      userId: number,
      todo: Record<ITodo>,
    }
  ) {}
}