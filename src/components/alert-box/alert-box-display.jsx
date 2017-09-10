import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const AlertMessage = (props) => {
  const { info, error } = props.message;
  if (!info && _.isEmpty(error)) return (<div />);
  let message = props.message.info;
  if (props.message.error) {
    message = `${props.message.error.code}: ${(props.message.error.source || {}).parameter || ''}`;
  }
  return (<div className={`alert alert-${props.message.error ? 'danger' : 'info'}`} role="alert">
    <p className="mb-0">{message}</p>
  </div>);
};

AlertMessage.propTypes = {
  message: PropTypes.shape({
    info: PropTypes.string,
    error: PropTypes.shape({
      code: PropTypes.string,
      source: PropTypes.shape({
        parameter: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default AlertMessage;
