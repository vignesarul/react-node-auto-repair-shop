import React from 'react';
import PropTypes from 'prop-types';

class Header extends React.Component {
  componentWillMount() {
    if (!this.props.token) {
      this.props.history.push('/auth/login');
    }
  }

  render() {
    return (<nav className="navbar navbar-toggleable-md navbar-light bg-faded">
      <div className="container">
        <a className="navbar-brand">Repair Shop</a>
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
            <li className="nav-item active">
              <a className="nav-link" role="link" tabIndex="-1" onClick={() => { this.props.doLogout(this.props.history); }}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>);
  }
}

Header.propTypes = {
  token: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  doLogout: PropTypes.func.isRequired,
};

Header.defaultProps = {
  token: '',
};

export default Header;
