import { connect } from 'react-redux';
import ListRepairs from 'components/list-repairs/list-repairs-display';
import { addDays } from 'common/helpers/dateConverter';
import _ from 'lodash';

// Map Redux state to component props
function mapStateToProps(store) {
  const { repair, user } = _.cloneDeep(store);
  return {
    repairStore: repair,
    userStore: user,
  };
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
  return {
    actionMethods: {
      performSearch: (e) => {
        e.preventDefault();
        const formData = _.pickBy({
          title: e.target.title.value,
          userId: e.target.userId.value,
          approved: e.target.status.value === 'approved' ? true : undefined,
          completed: e.target.status.value === 'completed' ? true : undefined,
          dateFrom: e.target.from.value ? addDays({ date: e.target.from.value, count: 0, format: 'YYYY-MM-DD' }) : undefined,
          dateTo: e.target.to.value ? addDays({ date: e.target.to.value, count: 0, format: 'YYYY-MM-DD' }) : undefined,
        });
        if (formData.completed) formData.approved = false;
        else if (e.target.status.value === 'default') {
          formData.approved = false;
          formData.completed = false;
        }

        _.map(_.keys(formData), (field) => {
          const ltOperator = (field.search(/to/i) > -1 ? 'lte' : 'eq');
          const operator = (field.search(/from/i) > -1) ? 'gte' : ltOperator;
          let actualField = field;
          if (field.search(/date/i) > -1) actualField = 'date';
          formData[field] = `(${actualField} ${operator} ${formData[field]})`;
        });

        const filter = _.values(formData).join(' AND ');
        dispatch({ type: 'QUERY_REPAIRS', requestBody: { filter: _.keys(formData).length > 1 ? `(${filter})` : filter } });
      },

      performSearchByUser: (e) => {
        e.preventDefault();
        const formData = _.pickBy({
          title: e.target.title.value,
          approved: e.target.status.value === 'approved' ? true : undefined,
          completed: e.target.status.value === 'completed' ? true : undefined,
          dateFrom: e.target.from.value ? addDays({ date: e.target.from.value, count: 0, format: 'YYYY-MM-DD' }) : undefined,
          dateTo: e.target.to.value ? addDays({ date: e.target.to.value, count: 0, format: 'YYYY-MM-DD' }) : undefined,
        });
        if (formData.completed) formData.approved = false;
        else if (e.target.status.value === 'default') {
          formData.approved = false;
          formData.completed = false;
        }
        _.map(_.keys(formData), (field) => {
          const ltOperator = (field.search(/to/i) > -1 ? 'lte' : 'eq');
          const operator = (field.search(/from/i) > -1) ? 'gte' : ltOperator;
          let actualField = field;
          if (field.search(/date/i) > -1) actualField = 'date';
          formData[field] = `(${actualField} ${operator} ${formData[field]})`;
        });

        const filter = _.values(formData).join(' AND ');
        dispatch({ type: 'GET_REPAIRS', requestBody: { filter: _.keys(formData).length > 1 ? `(${filter})` : filter, userId: e.target.userId.value } });
      },
      loadMore: (role, userId, next) => {
        if (role !== 'user') {
          dispatch({ type: 'QUERY_REPAIRS', requestBody: { next } });
        } else {
          dispatch({ type: 'GET_REPAIRS', requestBody: { userId, next } });
        }
      },
      refreshAllRepair: () => {
        const requestBody = {};
        dispatch({ type: 'QUERY_REPAIRS', requestBody });
      },
      retriveRepairs: (userId) => {
        const requestBody = {
          userId,
        };
        dispatch({ type: 'GET_REPAIRS', requestBody });
      },
      markCompleted: (e) => {
        const role = e.target.getAttribute('data-role');
        const requestBody = {
          userId: e.target.getAttribute('data-userId'),
          repairId: e.target.getAttribute('data-id'),
          completed: true,
        };
        dispatch({ type: role === 'user' ? 'UPDATE_REPAIR_BY_USER' : 'UPDATE_REPAIR_BY_ADMIN', requestBody });
      },
      markIncomplete: (e) => {
        const requestBody = {
          userId: e.target.getAttribute('data-userId'),
          repairId: e.target.getAttribute('data-id'),
          completed: false,
        };
        dispatch({ type: 'UPDATE_REPAIR_BY_ADMIN', requestBody });
      },
      markApproved: (e) => {
        const requestBody = {
          userId: e.target.getAttribute('data-userId'),
          repairId: e.target.getAttribute('data-id'),
          approved: true,
        };
        dispatch({ type: 'UPDATE_REPAIR_BY_ADMIN', requestBody });
      },
      deleteRepair: (e) => {
        const requestBody = {
          userId: e.target.getAttribute('data-userId'),
          repairId: e.target.getAttribute('data-id'),
        };
        dispatch({ type: 'DELETE_REPAIR', requestBody });
      },
      getUser: (userId) => {
        const requestBody = {
          userId,
        };
        dispatch({ type: 'GET_USER', requestBody });
      },
    },
  };
}

// Connected Component
const ListRepairsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListRepairs);

export default ListRepairsContainer;
