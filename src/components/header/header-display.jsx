import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Header extends React.Component {
  componentWillMount() {
    if (!this.props.userStore.token) {
      this.props.history.push('/auth/login');
    }
  }

  render() {
    const { userStore } = this.props;
    return (<nav className="navbar navbar-toggleable-md navbar-light bg-faded">
      <div className="container">
        <Link to={`/users/${userStore.user.id}/repairs?userId=${userStore.user.id}`} className="navbar-brand">Repair Shop</Link>
        <button
          className="navbar-toggler navbar-toggler-right"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        ><span className="navbar-toggler-icon" /></button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto" />
          <ul className="navbar-nav">
            {userStore.user.attributes.roles !== 'user' ?
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Users
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  <Link to="/users" className="dropdown-item">List Users</Link>
                  <Link to="/users/add" className="dropdown-item">Add User</Link>
                </div>
              </li> : '' }
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Repairs
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                {userStore.user.attributes.roles !== 'user' ? <div><Link to={`/users/${userStore.user.id}/repairs`} className="dropdown-item">List Repairs</Link>
                  <Link to={`/users/${userStore.user.id}/repairs/create`} className="dropdown-item">Add Repair</Link></div> : '' }
                <Link to={`/users/${userStore.user.id}/repairs?userId=${userStore.user.id}`} className="dropdown-item">My Repairs</Link>
              </div>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                My Account
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <Link to={`/users/${userStore.user.id}/edit`} className="dropdown-item">Edit my profile</Link>
                <a className="dropdown-item" role="link" tabIndex="-1" onClick={() => { this.props.doLogout(this.props.history); }}>Logout</a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>);
  }
}

Header.propTypes = {
  userStore: PropTypes.shape({
    token: PropTypes.string,
    user: PropTypes.shape({
      id: PropTypes.string,
    }),
    isLoading: PropTypes.bool.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  doLogout: PropTypes.func.isRequired,
};

export default Header;
