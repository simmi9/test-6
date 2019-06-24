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
  ADD_CAT_FACT = 'ADD_CAT_FACT',
  DELETE_USER = 'DELETE_USER',
  DELETE_TODO = 'DELETE_TODO',
  ADD_SUB_TODO = 'ADD_SUB_TODO',
  MARK_COMPLETED = 'MARK_COMPLETED',
}

export interface IUser {
  id: number;
  name: string;
}

export const UserFactory = Record<IUser>({
  id: -1,
  name: '',
});

export interface ITodo {
  id:  number;
  userId: number;
  title: string;
  completed: boolean;
  isSubtodo: boolean;
  subtodo: Record<ITodo>;     
}  

export const TodoFactory = Record<ITodo>({        
  id: -1,  
  userId: -1,
  title: 'untitled', 
  completed: false,
  isSubtodo: false,
  subtodo: {} as Record<ITodo>,            
});

export class AddUserAction implements IAction {
  public readonly type = DefaultActionTypes.ADD_USER;
  constructor(
    public payload: {
      user: Record<IUser>,
    }
  ) {}
}

export class DeleteUserAction implements IAction {
  public readonly type = DefaultActionTypes.DELETE_USER;
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

export class DeleteTodoAction implements IAction {
  public readonly type = DefaultActionTypes.DELETE_TODO;
  constructor(
    public payload: {
      userId: number,
      todo: Record<ITodo>, 
    }
  ) {}
}

export class AddSubTodoAction implements IAction {
  public readonly type = DefaultActionTypes.ADD_SUB_TODO;
  constructor(
    public payload: {
      userId: number,  
      todo: Record<ITodo>,  
    }
  ) {}
}

export class MarkTodoCompletedAction implements IAction {
  public readonly type = DefaultActionTypes.MARK_COMPLETED;
  constructor(
    public payload: {
      userId: number,
      todo: Record<ITodo>,
    }
  ) {}
}

export class AddCatFactAction implements IAction {
  public readonly type = DefaultActionTypes.ADD_CAT_FACT;
  constructor(
    public payload: {
      userId: number,
      todo: Record<ITodo>,
    }
  ) {}
}