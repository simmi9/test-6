



import {
  Action,
} from 'redux';
export interface IAction extends Action<string> {
  payload?: any;
  callback?: (...args: any[]) => void;
}

export interface IMatch<T = {
  [key: string]: string;
}> {
  isExact: boolean;
  params: T;
  path: string;
  url: string;
}

import {
  Reducer,
} from 'redux';

import {
  Record,
} from 'immutable';

// export type GenericReducer = (state: ReducerState, action: IAction) => ReducerState;
export type ReducerState = Record<any>;
export type GenericReducer = Reducer<ReducerState, IAction>;

export interface InjectedReducers { // tslint:disable-line
  [s: string]: GenericReducer;
}
export interface IDescriptor {
  mode?: string;
  saga?: GenericSaga;
  task?: SagaTask;
}
export type SagaTask = any;
export type GenericSaga = any;
export interface InjectedSagas { // tslint:disable-line
  [s: string]: GenericSaga;
}