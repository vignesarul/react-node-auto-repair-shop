import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const AlertMessage = (props) => {
  const { info, error } = props.message;
  console.log(error);
  if (!info && _.isEmpty(error)) return (<div />);
  let message = props.message.info;
  if (!_.isEmpty(error)) {
    const param = (props.message.error.source || {}).parameter || '';
    message = `${props.message.error.code}${param ? `: ${param}` : ''} `;
  }
  return (<div className={`alert alert-${!_.isEmpty(error) ? 'danger' : 'info'}`} role="alert">
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
