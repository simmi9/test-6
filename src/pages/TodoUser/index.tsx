import React, { useState } from 'react';
import {
  compose,
  bindActionCreators,
  AnyAction,
  Dispatch,
} from 'redux';
import { IMatch } from '../../Interfaces';
import {
  getIn,
  Record,
  List,
} from 'immutable';
import { connect } from 'react-redux';
import {
  Grid,
  Typography,
  Button,
  TextField,
} from '@material-ui/core';
import {
  AddTodoAction,
  DeleteTodoAction,
  AddSubTodoAction,
  MarkTodoCompletedAction,
  ITodo,
  TodoFactory,
  IUser,
} from '../../actions/default';
import {
  makeSelectTodosForUser,
  makeSelectUser,
} from '../../selectors/default';
import { createStructuredSelector } from 'reselect';

interface ITodoComponentProps {
  match: IMatch,
}

interface ITodoProps extends ITodoComponentProps {
  addTodo: (userId: number, todo: Record<ITodo>) => void;
  deleteTodo: (userId: number, todo: Record<ITodo>) => void;
  addSubTodo: ( userId: number, todo: Record<ITodo>) => void;
  markTodoCompleted: ( userId: number, todo: Record<ITodo>) => void;  
  userId: number;
  todosForUser: List<Record<ITodo>>;
  user?: Record<IUser>;  
}


const addTodo = (userId: number, todo: Record<ITodo>) => new AddTodoAction({ userId, todo });
const deleteTodo = (userId: number, todo: Record<ITodo>) => new DeleteTodoAction({ userId, todo });

const  addSubTodo = (userId: number, todo: Record<ITodo>) => new AddSubTodoAction({userId, todo}); 
const  markTodoCompleted = (userId: number, todo: Record<ITodo>) => new MarkTodoCompletedAction({userId, todo});   

const Todo: React.FC<ITodoProps> = (props) => {
  const [textInput, setTextInput] = useState('');
  const [textInputAnother, setTextInputAnother] = useState('');    

  const {
    addTodo,
    deleteTodo,
    addSubTodo,
    markTodoCompleted,
    userId,
    todosForUser,
    user,
  } = props;
  if (user == null) {
    return (
      <Grid
        container={true}
        direction='column'
        wrap='nowrap'
      >
        <Grid
          item={true}
        >
          <Typography
            variant='h5'
          >
            INVALID USER
          </Typography>
        </Grid>
      </Grid>
    );
  }
  return (
    <Grid
      container={true}
      direction='column'
      wrap='nowrap'
    >
      <Grid
        item={true}
      >
        <Typography
          variant='h5'
        >
          TODOS FOR {user.get('name')}
        </Typography>
      </Grid>
      <Grid
        container={true}
        item={true}
        direction='column'
        wrap='nowrap'
      >
        <Grid
          item={true}
          container={true}
          alignItems='center'
        >
          <Grid
            item={true}
          >
            <TextField
              label='title'
              value={textInput}
              onChange={(e) => {
                setTextInput(e.target.value);
              }}
            />
          </Grid>
          <Grid
            item={true}
          >
            <Button
              variant='outlined'
              onClick={
                () => {
                  addTodo(
                    userId,
                    TodoFactory({  
                      title: textInput,
                      isSubtodo:false,  
                    }),
                  );
                  setTextInput('');   
                }
              }
            >
              Add Todo
            </Button>
          </Grid>
        </Grid> 


        {
          todosForUser.map((todo, index) => {
            return ( <section key={index}>      
            <Grid
              item={true}
              className={`todo-individual-${todo.get('id')}`}   
            >
            <div className={`todo-title-${todo.get('completed')}`}>
              {todo.get('title')}               
            </div>  
                <div className ="todo-buttons">
                <Button
                    variant='outlined'
                    onClick={   
                      () => {
                        markTodoCompleted(
                          userId,
                          TodoFactory({
                               id: todo.get('id'),
                           userId: userId,
                            title: todo.get('title'),
                          }),
                        );
                      }  
                    }
                    className={`button-completed-${todo.get('completed')}`}
                  >
                    Mark Completed
                  </Button>    
               
                  <Button  
                    variant='outlined'
                    onClick={
                      () => {
                        deleteTodo(
                          userId,
                          TodoFactory({
                               id: todo.get('id'),    
                           userId: userId,
                            title: textInput,  
                          }),
                        );
                      }
                    }
                    className={`button-delete-${todo.get('isSubtodo')}-${todo.get('completed')}`}                
                  >
                    Delete Todo
                  </Button> 

                  <Button
                    key={index}  
                    variant='outlined'
                    onClick={
                      () => {
                        addSubTodo(
                          userId,
                          TodoFactory({   
                               id: todo.get('id'),   
                           userId: userId,
                            title: textInputAnother,    
                            isSubtodo: true,  
                            subtodo: undefined,
                          }),  
                        );
                         setTextInput('');     
                      }
                    }
                    className={`button-completed-${todo.get('completed')} button-addsubtodo-${todo.get('isSubtodo')}`}      
                  >
                    Add Sub ToDos
                  </Button>  
                      
                <TextField  
                  label='title'
                  value={textInputAnother}
                  onChange={(e) => {
                    setTextInputAnother(e.target.value);    
                  }}  
                   className={`text-completed-${todo.get('completed')} text-addsubtodo-${todo.get('isSubtodo')}`}
                />
              
          </div>
        </Grid> 
        </section>);

          })
        }
      </Grid>
    </Grid>
  );
}

const mapStateToProps = (state: any, props: ITodoComponentProps) => {
  const {
    match,
  } = props;
  const userId = parseInt(getIn(match, ['params', 'userId'], -1), 10); // from path / router
  return {
    userId,
    ...createStructuredSelector({
      todosForUser: makeSelectTodosForUser(userId),
      user: makeSelectUser(userId),
    })(state)
  }
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    ...bindActionCreators({ addTodo, deleteTodo, addSubTodo, markTodoCompleted }, dispatch)
  };
};
  

export default compose<React.ComponentClass<ITodoComponentProps>>(
  connect(mapStateToProps, mapDispatchToProps)
)(Todo);