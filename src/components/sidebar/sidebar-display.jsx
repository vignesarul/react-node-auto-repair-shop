import React from 'react';
import PropTypes from 'prop-types';

const SideBar = props => (<div className="col-md-3 leftSideBar">
  <div className="hidden-md-down card sideBarProfile">
    <div className="profileImg">
      <img className="card-img-top rounded-circle" src={`http://i.pravatar.cc/150?u=${props.userStore.user.id}`} alt={props.userStore.user.attributes.firstName} />
    </div>
    <div className="card-block">
      <h4>Welcome {props.userStore.user.attributes.firstName},</h4>
      {props.userStore.user.attributes.roles !== 'user' ? <p>Manage users and their repairs. </p> : <p>Manage your repairs and complete them. </p> }
    </div>
  </div>
</div>);

SideBar.propTypes = {
  userStore: PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.string,
      attributes: PropTypes.shape({
        firstName: PropTypes.string,
        roles: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default SideBar;
