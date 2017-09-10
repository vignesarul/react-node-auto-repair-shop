import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Sidebar from 'components/sidebar/sidebar-container';
import AlertMessage from 'components/alert-box/alert-box-display';

class ListRepairs extends React.Component {
  componentDidMount() {
    this.props.retriveRepairs(this.props.match.params.userId);
  }

  componentWillReceiveProps(props) {
    if (props.match.params.userId !== this.props.match.params.userId) {
      this.props.retriveRepairs(props.match.params.userId);
    }
  }

  render() {
    console.log('this.props', this.props);
    return (<div className="py-5">
      <div className="container">
        <div className="row">
          <Sidebar userId={this.props.user.id} />
          <div className="col-md-9">
            <div className="card">
              <div className="card-header">Users</div>
              {(this.props.info || this.props.error) ? <AlertMessage message={this.props} /> : ''}
              <div className="card-block">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Desc</th>
                      <th>Calories</th>
                      <th>DailyGoal</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(this.props.isLoading ? [] : (this.props.repairsList || [])).map(repair => (<tr key={repair.id}>
                      <td>{repair.id}</td>
                      <td>{repair.attributes.text}</td>
                      <td>{repair.attributes.calories}</td>
                      <td><i
                        className={repair.attributes.dailyGoal ? 'fa fa-check' : 'fa fa-close'}
                        style={{ color: repair.attributes.dailyGoal ? 'green' : 'red' }}
                      /></td>
                      <td>
                        <Link to={`/users/${repair.userId}/repairs/${repair.id}`}><i className="fa fa-edit" /></Link> &nbsp;
                        <Link to={`/users/${repair.userId}/repairs/${repair.id}`}><i className="fa fa-trash" /></Link>
                      </td>
                    </tr>))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
  }
}

ListRepairs.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
  }),
  info: PropTypes.string,
  error: PropTypes.shape({
    code: PropTypes.string,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string,
    }),
  }).isRequired,
  repairsList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
  })),
  isLoading: PropTypes.bool.isRequired,
  retriveRepairs: PropTypes.func.isRequired,
};

ListRepairs.defaultProps = {
  repairsList: [],
  user: {},
  error: {},
  info: '',
};

export default ListRepairs;
