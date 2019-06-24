import {
  fromJS,
  Record,
  Map,
} from 'immutable';
import {
  IAction,
} from '../Interfaces';

import {
  DefaultActionTypes,
  ITodo,
  AddTodoAction,
  DeleteTodoAction,
  AddSubTodoAction,
  MarkTodoCompletedAction,
  IUser,
  AddUserAction,
  DeleteUserAction,
  UserFactory,
  TodoFactory,
} from '../actions/default';

// import {
//   Settings,
// } from '../../models';

export interface IReducerState {
  lastUserId: number;
  lastTodoId: number;
  users: Map<number, Record<IUser>>;
  todos: Map<number, Record<ITodo>>;
}

const initialUsers = [
  UserFactory({
    id: 1,
    name: 'Ryan',
  }),
  UserFactory({
    id: 2,
    name: 'Sandy',
  }),
  UserFactory({
    id: 3,
    name: 'Sean',
  }),
  UserFactory({
    id: 4,
    name: 'Peter',
  }),
]

const initialTodos = [
  TodoFactory({
    id: 1,
    userId: 1,
    title: 'Drink Water',
  })
]
const INITIAL_STATE = fromJS({
  lastUserId: initialUsers.length,
  lastTodoId: initialTodos.length,
  users: Map<number, Record<IUser>>().withMutations((mutableMap) => {
    initialUsers.forEach((user) => {
      mutableMap.set(user.get('id'), user);
    })
  }),
  todos: Map<number, Record<ITodo>>().withMutations((mutableMap) => {
    initialTodos.forEach((todo) => {
      mutableMap.set(todo.get('id'), todo);
    })
  }),
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

      if (user.get('name') === '') {
        console.debug('no name!')
        return state;
      }

      const userId = lastUserId + 1;
      return state.withMutations((mutableState) => {
        mutableState.set('lastUserId', userId);
        mutableState.setIn(
          ['users', userId],
          user.set('id', userId),
        );
      })
    }
    case DefaultActionTypes.DELETE_USER: {
      const {
        payload,
      } = action as DeleteUserAction;
      const {
        user,
      } = payload;

      console.log(user);  
      return state.withMutations((mutableState) => {
        mutableState.set('users', mutableState.get('users').filter(o => o.get('id') !== user.get('id')));
      })
    }
    case DefaultActionTypes.ADD_TODO: {
      const lastTodoId = state.get('lastTodoId');
      const {
        payload,
      } = action as AddTodoAction;
      const {
        userId,
        todo,
      } = payload;

      if (todo.get('title') === '') {
        console.debug('no title!')
        return state;
      }

      const todoId = lastTodoId + 1;
      return state.withMutations((mutableState) => {
        mutableState.set('lastTodoId', todoId);
        mutableState.setIn(
          ['todos', todoId],
          todo.withMutations((mutableTodo) => {
            mutableTodo.set('id', todoId)
            mutableTodo.set('userId', userId)
          }),
        );
      });
    }
     case DefaultActionTypes.DELETE_TODO: {
     const lastTodoId = state.get('lastTodoId');
      const {
        payload,
      } = action as AddTodoAction;
      const {
        userId,
        todo,
      } = payload;
      const todoId = lastTodoId - 1;
      return state.withMutations((mutableState) => {
       mutableState.set('lastTodoId', todoId);  
      mutableState.set('todos', mutableState.get('todos').filter(o => o.get('id') !== todo.get('id')));    
      });
    }
    case DefaultActionTypes.ADD_SUB_TODO:{
    const lastTodoId = state.get('lastTodoId');
      const {
        payload,
      } = action as AddSubTodoAction;
      const {
        userId,
        todo,
      } = payload;

      if (todo.get('title') === '') {
        console.debug('no title!')
        return state;
      }
     const todoId = lastTodoId + 1;         

      return state.withMutations((mutableState) => {
         mutableState.set('lastTodoId', todoId); 
        mutableState.setIn(
          ['todos', todoId],
          todo.withMutations((mutableTodo) => {
          mutableTodo.set('subtodo', todo);            
          }),
        );      
      }); 
    }
    case DefaultActionTypes.MARK_COMPLETED:{
    const lastTodoId = state.get('lastTodoId');
      const {
        payload,
      } = action as AddSubTodoAction;
      const {
        userId,
        todo, 
      } = payload;

      let id= lastTodoId;    
      let cond1 = false;
      let cond2 = false;    
      const lasttodo = state.get('todos').get(lastTodoId);  
      if(lasttodo){   
      const issub = lasttodo.get("isSubtodo"); 
        if(issub && !lasttodo.get('completed')){
        id= lastTodoId ;
        }else if(!issub && lasttodo.get('completed')){
        id =todo.get('id'); 
        } 
      }  
           
      return state.withMutations((mutableState) => {  
            mutableState.setIn(
              ['todos',id],      
              todo.withMutations((mutableTodo) => {
              if(mutableTodo.get('completed') === false){
              mutableTodo.set('completed', true);      
              }   
              }),  
            );      
          });   
    }
    default:
      return state;
  }
};

export default reducer;
  