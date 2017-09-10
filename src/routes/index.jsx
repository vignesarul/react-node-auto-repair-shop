import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from 'components/header/header-container';
import CreateUser from 'components/create-user/create-user-container';
import Login from 'components/login/login-container';
import ListRepairs from 'components/list-repairs/list-repairs-container';
import AddRepair from '../components/add-repair/add-repair-container';

const Routes = () => (<div>
  <Route path="/(users|roles)" component={Header} />
  <Switch>
    <Route path="/auth/create-account" component={CreateUser} />
    <Route path="/auth/login" component={Login} />
    <Route exact path="/users/:userId/repairs" component={ListRepairs} />
    <Route exact path="/users/:userId/repairs/create" component={AddRepair} />
  </Switch>
</div>);

export default Routes;
