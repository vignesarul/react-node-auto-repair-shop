import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const SideBar = props => (<div className="col-md-3">

  {props.userStore.user.attributes.roles !== 'user' ? (<ul className="nav nav-pills flex-column">
    <li className="nav-item">
      <Link to={`/users/${props.userStore.user.id}/repairs/create`} className="nav-link"><i className="fa fa-home" /> Add Repair</Link>
    </li><li className="nav-item">
      <Link to={`/users/${props.userStore.user.id}/repairs`} className="nav-link"><i className="fa fa-home" /> All repairs</Link>
    </li>
    <li className="nav-item">
      <Link to="/users" className="nav-link"><i className="fa fa-home" /> List Users</Link>
    </li></ul>) : ''}
  <ul className="nav nav-pills flex-column">
    <li className="nav-item">
      <Link to={`/users/${props.userStore.user.id}/repairs?userId=${props.userStore.user.id}`} className="nav-link"><i className="fa fa-home" /> My repairs</Link>
    </li>
    <li className="nav-item">
      <Link to={`/users/${props.userStore.user.id}/edit`} className="nav-link"><i className="fa fa-home" /> Edit my profile</Link>
    </li>
  </ul>
  <hr className="" />
  <div className="hidden-md-down card">
    <div className="card-block">
      <h4>Card title</h4>
      <p>Some quick example text to build on the card title .</p>
    </div>
  </div>
</div>);

SideBar.propTypes = {
  userStore: PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.string,
      attributes: PropTypes.shape({
        roles: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default SideBar;
