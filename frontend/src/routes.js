import React from 'react';
import { createBrowserHistory } from "history";

import { BrowserRouter, Route, Switch, Redirect, Router } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword.jsx';
import UpdatePassword from './pages/UpdatePassword';
import Confirm from './pages/Confirm';
import Profile from './pages/Profile.jsx';

import isAuthenticated from './services/auth';

const hist = createBrowserHistory();


const PrivateRoute = ({ component: Component, ...rest }) => {
      return (
            <Route
                  {...rest}
                  render={props => (
                        isAuthenticated() ? (
                              <Component {...props} />
                        ) : (
                                    <Redirect to={{ pathname: '/', state: {from: props.location} }}/>
                              ))
                  }
            />
      );
};


const PublicRoute = ({ component: Component, ...rest }) => {
      return (
            <Route
                  {...rest}
                  render={props =>
                        !isAuthenticated() ? (
                              <Component {...props} />
                        ) : (
                                    <Redirect from="/"
                                          to={{
                                                pathname: '/dashboard',
                                                state: { message: 'Usuário logado' }
                                          }}
                                    />
                              )}
            />
      );
};

export default function Routes() {

      return (
            <BrowserRouter basename={window.location.pathname || ''} >
                  <Router history={hist} basename={window.location.pathname || ''}>
                        <Switch>

                              <PrivateRoute path="/dashboard" component={Dashboard} />
                              <PrivateRoute path="/profile" component={Profile} />

                              <PublicRoute exact path='/updatepassword' component={UpdatePassword} />
                              <PublicRoute exact path='/forgotpassword' component={ForgotPassword} />
                              <PublicRoute exact path='/register' component={Register} />
                              <PublicRoute exact path='/' component={Login} />
                              <Route path='/confirm' render={() => (
                                    <Confirm />
                              )} />
                        </Switch>
                  </Router>
            </BrowserRouter>
      )
};