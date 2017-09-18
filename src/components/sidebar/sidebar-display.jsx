import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const SideBar = props => (<div className="col-md-3">
  <ul className="nav nav-pills flex-column">
    <li className="nav-item">
      <Link to={`/users/${props.userId}/repairs/create`} className="nav-link"><i className="fa fa-home" /> Add Repair</Link>
    </li>
    <li className="nav-item">
      <Link to={`/users/${props.userId}/repairs`} className="nav-link"><i className="fa fa-home" /> All repairs</Link>
    </li>
    <li className="nav-item">
      <Link to={`/users/${props.userId}/repairs?userId=${props.userId}`} className="nav-link"><i className="fa fa-home" /> My repairs</Link>
    </li>
    <li className="nav-item">
      <Link to="/users" className="nav-link"><i className="fa fa-home" /> List Users</Link>
    </li>
    <li className="nav-item">
      <Link to={`/users/${props.userId}/edit`} className="nav-link"><i className="fa fa-home" /> Edit my profile</Link>
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
  userId: PropTypes.string,
};

SideBar.defaultProps = {
  userId: '',
};

export default SideBar;
