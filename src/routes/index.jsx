import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from 'components/header/header-container';
import CreateUser from 'components/create-user/create-user-container';
import VerifyAccount from 'components/verify-account/verify-account-container';
import Login from 'components/login/login-container';
import ListUsers from 'components/list-users/list-users-container';
import AddUser from 'components/add-user/add-user-container';
import EditUser from 'components/edit-user/edit-user-container';
import ListRepairs from 'components/list-repairs/list-repairs-container';
import AddRepair from 'components/add-repair/add-repair-container';
import EditRepair from 'components/edit-repair/edit-repair-container';
import ViewRepair from 'components/view-repair/view-repair-container';

const Routes = () => (<div>
  <Route path="/(users|roles)" component={Header} />
  <Switch>
    <Route path="/auth/create-account" component={CreateUser} />
    <Route path="/auth/verify-account" component={VerifyAccount} />
    <Route path="/auth/login" component={Login} />
    <Route exact path="/users" component={ListUsers} />
    <Route exact path="/users/add" component={AddUser} />
    <Route exact path="/users/:userId/edit" component={EditUser} />
    <Route exact path="/users/:userId/repairs" component={ListRepairs} />
    <Route exact path="/users/:userId/repairs/create" component={AddRepair} />
    <Route exact path="/users/:userId/repairs/:repairId/edit" component={EditRepair} />
    <Route exact path="/users/:userId/repairs/:repairId" component={ViewRepair} />
  </Switch>
</div>);

export default Routes;
