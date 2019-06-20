import React from 'react';
import { Provider } from 'react-redux';
import './App.css';

import { ConnectedRouter } from 'connected-react-router/immutable';
import configureStore from './configureStore';
import sagas from './sagas';
import { createBrowserHistory } from 'history';

import defaultReducer from './reducers/default';

import Home from './pages/Home';
import UserList from './pages/UserList';
import Todo from './pages/Todo';
import TodoUser from './pages/TodoUser';

import {
  Route,
  Switch,
} from 'react-router';

import {
  Typography,
  Grid,
} from '@material-ui/core';
import { Link } from 'react-router-dom';

const basename = '/';

const history = createBrowserHistory({
  basename,
});
const store = configureStore({
  reducers: {
    default: defaultReducer,
  },
  history,
});

[
  ...sagas,
].forEach((saga) => {
  if (store.runSaga != null) {
    store.runSaga(saga);
  }
});

const App: React.FC = () => {
  return (
    <Provider
      store={store}
    >
      <ConnectedRouter
        history={history}
      >
        <div className='App'>
          <Grid
            container={true}
          >
            <Grid
              container={true}
              spacing={1}
              item={true}
            >
              <Grid
                item={true}
              >
                <Link to='/'>
                  Home
                </Link>
              </Grid>
              <Grid
                item={true}
              >
                <Link to='/users'>
                  User List
                </Link>
              </Grid>
              <Grid
                item={true}
              >
                <Link to='/todo'>
                  Todos
                </Link>
              </Grid>
            </Grid>
          </Grid>
          <Switch>
            <Route path={'/users'} exact={true} component={UserList} />
            <Route path={'/todo'} exact={true} component={Todo} />
            <Route path={'/todo/:userId?'} component={TodoUser} />
            <Route path={'/'} exact={true} component={Home} />
            <Route component={() => <Typography>404</Typography>} />
          </Switch>
        </div>
      </ConnectedRouter>
    </Provider>
  );
}

export default App;
