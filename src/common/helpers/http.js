import axios from 'axios';

const apiLink = 'http://localhost:3001/api/v1';

const callApi = (method, url, body, config = {}) => axios[method](`${apiLink}${url}`, body || config, config)
  .then(result => result.data)
  .catch((err) => {
    const error = err.response ? err.response.data : err;
    console.log(error);
    return error;
  });

export default callApi;
