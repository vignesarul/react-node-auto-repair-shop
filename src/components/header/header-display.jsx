import React from 'react';
import PropTypes from 'prop-types';

class Header extends React.Component {
  componentWillMount() {
    if (!this.props.token) {
      this.props.history.push('/auth/login');
    }
  }

  render() {
    return (<nav className="navbar navbar-expand-md navbar-light bg-faded">
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
          <form className="form-inline my-2 my-lg-0">
            <input className="form-control mr-sm-2" type="text" placeholder="Search" />
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form>
          <ul className="navbar-nav">
            <li className="nav-item">
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
