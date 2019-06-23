import React, { useState } from 'react';
import { compose, bindActionCreators, AnyAction, Dispatch } from 'redux';
import { IMatch } from '../../Interfaces';
import {
  Record,
  Map,
} from 'immutable';
import { connect } from 'react-redux';
import { Grid, Typography, Button, TextField } from '@material-ui/core';
import {
  AddUserAction,
  DeleteUserAction,
  IUser,
  UserFactory,
} from '../../actions/default';
import {
  makeSelectUsers,
} from '../../selectors/default';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';

interface IUserListComponentProps {
  match: IMatch,
}

interface IUserListProps extends IUserListComponentProps {
  addUser: (user: Record<IUser>) => void;
  deleteUser: (user: Record<IUser>) => void;
  users: Map<number, Record<IUser>>;
}

const addUser = (user: Record<IUser>) => new AddUserAction({ user });
const deleteUser = (user: Record<IUser>) => new DeleteUserAction({ user});

const UserList: React.FC<IUserListProps> = (props) => {
  const [textInput, setTextInput] = useState('');

  const {
    addUser,
    deleteUser,
    users,
  } = props;
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
          Users
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
              label='name'
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
                  addUser(
                    UserFactory({
                      name: textInput,
                    }),
                  );
                  setTextInput('');
                }
              }
            >
              Add User
            </Button>
          </Grid>
        </Grid>
        
        {
          users.map((user, userId) => {
            return <Grid
              spacing={1}
              container={true}
              key={userId}
              item={true}
            >
              <Grid
                item={true}
              >
                <Typography>
                  {userId}:
                </Typography>
              </Grid>
              <Grid
                item={true}
              >
                <Typography>
                  {user.get('name')}
                </Typography>
              </Grid>
              <Grid
                item={true}
              >
                <Link
                  to={`/todo/${userId}`}
                >
                  <Typography>
                    todos
                  </Typography>
                </Link>
              </Grid>


              <Grid
                item={true}
              >
                < Button  
                  variant='outlined'
                  onClick={
                () => {
                  deleteUser(
                    UserFactory({
                      id: userId,
                      name: user.get('name'),
                    }),
                  );
                } 
              }
                >
                  <Typography>
                    Delete User
                  </Typography>
                </Button>
              </Grid>
            </Grid>;
          }).valueSeq().toArray()
        }
      </Grid>
    </Grid>
  );
}

const mapStateToProps = createStructuredSelector({
  users: makeSelectUsers(),
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    ...bindActionCreators({ addUser,deleteUser}, dispatch)
  };
};


export default compose<React.ComponentClass<IUserListComponentProps>>(
  connect(mapStateToProps, mapDispatchToProps)
)(UserList);