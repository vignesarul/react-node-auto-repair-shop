import test from 'ava';
import jsf from 'json-schema-faker';
import supertest from 'supertest';
import moment from 'moment';
import { app, dbConnection } from 'server';
import userSchema from 'schema/user';
import repairSchema from 'schema/repair';
import _ from 'lodash';
import config from 'common/config/config';

const request = supertest.agent(config.server.host);
const userMock = jsf(userSchema.postSchema);
const repairMock = jsf(repairSchema.postSchema);
const momentRandom = () => moment(_.random(21727214, 4092636014));
const randomDateTime = { date: momentRandom().format('YYYY-MM-DD'), time: momentRandom().format('HH:mm:ss') };
let userToken;
let userId;
let userRepairId;
let userAutoCalRepairId;
let adminToken;
let adminId;
let umId;
let umToken;
let secondaryUserId;
let secondaryRepairId;

test.cb.before('it should create a new user', (t) => {
  request
    .post('/users')
    .type('json')
    .send(userMock)
    .expect('Content-Type', /json/)
    .expect(201)
    .then((res) => {
      userId = res.body.data[0].id;
      t.end();
    }).catch(err => console.log(err));
});

test.cb.before('it should activate user account', (t) => {
  dbConnection.getModels().user.getUser(userId).then((userDetails) => {
    request
      .put(`/users/${userId}/activate`)
      .send({ code: userDetails.verification.code })
      .type('json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        t.is(res.body.data[0].id, userId);
        t.is(res.body.data[0].attributes.status, 'ACTIVE');
        t.end();
      }).catch(err => console.log(err));
  }).catch(err => console.log(err));
});

test.cb.before('it should allow user to login', (t) => {
  request
    .post('/auth/login')
    .type('json')
    .send(_.pick(userMock, ['email', 'password']))
    .expect('Content-Type', /json/)
    .expect(200)
    .then((res) => {
      t.truthy(res.body.data[0].attributes.access_token);
      userToken = res.body.data[0].attributes.access_token;
      t.end();
    }).catch(err => console.log(err));
});

test.cb.before('it should allow admin to login', (t) => {
  request
    .post('/auth/login')
    .type('json')
    .send({ email: 'admin@admin.com', password: '1234567890' })
    .expect('Content-Type', /json/)
    .expect(200)
    .then((res) => {
      t.truthy(res.body.data[0].attributes.access_token);
      adminToken = res.body.data[0].attributes.access_token;
      dbConnection.getModels().access.verifyToken(adminToken).then((tokenDetails) => {
        adminId = tokenDetails.userId;
        t.end();
      });
    }).catch(err => console.log(err));
});

test.cb.before('it should allow admin to create a new active user', (t) => {
  request
    .post('/users')
    .type('json')
    .set('Authorization', adminToken)
    .send(jsf(userSchema.postSchema))
    .expect('Content-Type', /json/)
    .expect(201)
    .then((res) => {
      t.is(res.body.data[0].attributes.status, 'ACTIVE');
      secondaryUserId = res.body.data[0].id;
      t.end();
    }).catch(err => console.log(err));
});

test.cb('POST /users/:userId/repairs - it should allow admin to add a repair', (t) => {
  request
    .post(`/users/${userId}/repairs`)
    .set('Authorization', adminToken)
    .type('json')
    .send(_.merge(repairMock, randomDateTime))
    .expect('Content-Type', /json/)
    .expect(201)
    .then((res) => {
      t.truthy(res.body.data[0].id);
      userRepairId = res.body.data[0].id;
      t.end();
    }).catch(err => console.log(err));
});

test.cb('POST /users/:userId/repairs - it should not allow to add repair at same time slot', (t) => {
  request
    .post(`/users/${userId}/repairs`)
    .set('Authorization', adminToken)
    .type('json')
    .send(_.merge(repairMock, randomDateTime))
    .expect('Content-Type', /json/)
    .expect(409, t.end);
});

test.cb('POST /users/:userId/repairs - it should not allow user to add a repair', (t) => {
  request
    .post(`/users/${userId}/repairs`)
    .set('Authorization', userToken)
    .type('json')
    .send(repairMock)
    .expect('Content-Type', /json/)
    .expect(401, t.end);
});

test.cb('POST /users/:userId/repairs - it should allow admin to add a repair without userId, date and time', (t) => {
  request
    .post(`/users/${secondaryUserId}/repairs`)
    .set('Authorization', adminToken)
    .type('json')
    .send({ title: 'Testing' })
    .expect('Content-Type', /json/)
    .expect(201)
    .then((res) => {
      t.truthy(res.body.data[0].id);
      secondaryRepairId = res.body.data[0].id;
      t.end();
    }).catch(err => console.log(err));
});

test.cb('POST /users/:userId/repairs - it should throw error if required field is missing', (t) => {
  request
    .post(`/users/${userId}/repairs`)
    .set('Authorization', adminToken)
    .type('json')
    .send(_.omit(repairMock, 'title'))
    .expect('Content-Type', /json/)
    .expect(400, t.end);
});

test.cb('POST /users/:userId/repairs - it should throw error if payload is empty', (t) => {
  request
    .post(`/users/${userId}/repairs`)
    .set('Authorization', adminToken)
    .type('json')
    .send({})
    .expect('Content-Type', /json/)
    .expect(400, t.end);
});

test.cb('POST /users/:userId/repairs - it should throw error if Authorization is not sent', (t) => {
  request
    .post(`/users/${userId}/repairs`)
    .type('json')
    .send({})
    .expect('Content-Type', /json/)
    .expect(401, t.end);
});

test.cb('POST /users/:userId/repairs - it should not allow user to add a repair for other user', (t) => {
  request
    .post(`/users/${secondaryUserId}/repairs`)
    .set('Authorization', userToken)
    .type('json')
    .send(repairMock)
    .expect('Content-Type', /json/)
    .expect(401, t.end);
});

test.cb('GET /users/:userId/repairs/:RepairId - it should allow user to view repair details', (t) => {
  request
    .get(`/users/${userId}/repairs/${userRepairId}`)
    .set('Authorization', userToken)
    .expect('Content-Type', /json/)
    .expect(200)
    .then((res) => {
      t.truthy(_.isEqual(res.body.data[0].id, userRepairId));
      t.end();
    }).catch(err => console.log(err));
});

test.cb('GET /users/:userId/repairs/:RepairId - it should allow admin to view repair details', (t) => {
  request
    .get(`/users/${secondaryUserId}/repairs/${secondaryRepairId}`)
    .set('Authorization', adminToken)
    .expect('Content-Type', /json/)
    .expect(200)
    .then((res) => {
      t.truthy(_.isEqual(res.body.data[0].id, secondaryRepairId));
      t.end();
    }).catch(err => console.log(err));
});

test.cb('GET /users/:userId/repairs/:RepairId - it should not allow user to view other user\'s repair details - Method 1', (t) => {
  request
    .get(`/users/${secondaryUserId}/repairs/${secondaryRepairId}`)
    .set('Authorization', userToken)
    .expect('Content-Type', /json/)
    .expect(401, t.end);
});

test.cb('GET /users/:userId/repairs/:RepairId - it should not allow user to view other user\'s repair details - Method 2', (t) => {
  request
    .get(`/users/${userId}/repairs/${secondaryRepairId}`)
    .set('Authorization', userToken)
    .expect('Content-Type', /json/)
    .expect(401, t.end);
});

test.cb('GET /users/:userId/repairs/:RepairId - it should throw error is repair does not exist', (t) => {
  request
    .get(`/users/${userId}/repairs/598568fcc7ff280275a21e23`)
    .set('Authorization', userToken)
    .expect('Content-Type', /json/)
    .expect(404, t.end);
});

test.cb('GET /users/:userId/repairs - it should allow user to list repairs belongs to his account', (t) => {
  request
    .get(`/users/${userId}/repairs`)
    .set('Authorization', userToken)
    .expect('Content-Type', /json/)
    .expect(200)
    .then((res) => {
      t.truthy(_.isEqual(res.body.data[0].attributes.userId, userId));
      t.end();
    }).catch(err => console.log(err));
});

test.cb('GET /users/:userId/repairs - it should allow admin to list repairs belongs to an user account', (t) => {
  request
    .get(`/users/${userId}/repairs`)
    .set('Authorization', adminToken)
    .expect('Content-Type', /json/)
    .expect(200)
    .then((res) => {
      t.truthy(_.isEqual(res.body.data[0].attributes.userId, userId));
      t.end();
    }).catch(err => console.log(err));
});

test.cb('GET /users/:userId/repairs - it should allow admin to filter the list results', (t) => {
  request
    .get(`/users/${userId}/repairs`)
    .query({ filter: `(title eq ${repairMock.title})` })
    .set('Authorization', adminToken)
    .expect('Content-Type', /json/)
    .expect(200)
    .then((res) => {
      t.truthy(_.isEqual(res.body.data[0].id, userRepairId));
      t.end();
    }).catch(err => console.log(err));
});

test.cb('GET /users/:userId/repairs - it should not allow user to list repairs of other user', (t) => {
  request
    .get(`/users/${secondaryUserId}/repairs`)
    .set('Authorization', userToken)
    .expect('Content-Type', /json/)
    .expect(401, t.end);
});

test.cb('PUT /users/:userId/repairs/:RepairId - it should allow user to update repair details', (t) => {
  const repairUpdateMock = _.omit(jsf(repairSchema.updateByUserSchema), 'userId');
  request
    .put(`/users/${userId}/repairs/${userRepairId}`)
    .set('Authorization', userToken)
    .type('json')
    .send(repairUpdateMock)
    .expect('Content-Type', /json/)
    .expect(200)
    .then((res) => {
      t.deepEqual(_.pick(res.body.data[0].attributes, _.keys(repairUpdateMock)), repairUpdateMock);
      t.end();
    }).catch(err => console.log(err));
});

test.cb('PUT /users/:userId/repairs/:RepairId - it should allow admin to update repair details of a user', (t) => {
  const repairUpdateMock = _.omit(jsf(repairSchema.updateByManagerSchema), 'userId');
  request
    .put(`/users/${secondaryUserId}/repairs/${secondaryRepairId}/manage`)
    .set('Authorization', adminToken)
    .type('json')
    .send(repairUpdateMock)
    .expect('Content-Type', /json/)
    .expect(200)
    .then((res) => {
      t.deepEqual(_.pick(res.body.data[0].attributes, _.keys(repairUpdateMock)), repairUpdateMock);
      t.end();
    }).catch(err => console.log(err));
});

test.cb('PUT /users/:userId/repairs/:RepairId - it should throw error if input is malformed', (t) => {
  request
    .put(`/users/${userId}/repairs/${userRepairId}`)
    .set('Authorization', userToken)
    .type('json')
    .send({ date: '1234567' })
    .expect('Content-Type', /json/)
    .expect(400, t.end);
});

test.cb('PUT /users/:userId/repairs/:RepairId - it should throw error if input is empty', (t) => {
  request
    .put(`/users/${userId}/repairs/${userRepairId}`)
    .set('Authorization', userToken)
    .type('json')
    .send({})
    .expect('Content-Type', /json/)
    .expect(400, t.end);
});

test.cb('PUT /users/:userId/repairs/:RepairId - it should throw error if Authorization is not sent', (t) => {
  const repairUpdateMock = _.omit(jsf(repairSchema.updateByUserSchema), 'userId');
  request
    .put(`/users/${userId}/repairs/${userRepairId}`)
    .type('json')
    .send(repairUpdateMock)
    .expect('Content-Type', /json/)
    .expect(401, t.end);
});

test.cb('PUT /users/:userId/repairs/:RepairId - it should not allow user to update other user\'s repair details', (t) => {
  const repairUpdateMock = _.omit(jsf(repairSchema.updateByUserSchema), 'userId');
  request
    .put(`/users/${secondaryUserId}/repairs/${secondaryRepairId}`)
    .set('Authorization', userToken)
    .type('json')
    .send(repairUpdateMock)
    .expect('Content-Type', /json/)
    .expect(401, t.end);
});

test.cb('DELETE /users/:userId/repairs/:RepairId - it should not allow user to delete his repair', (t) => {
  request
    .delete(`/users/${userId}/repairs/${userRepairId}`)
    .set('Authorization', userToken)
    .expect(401, t.end);
});

test.cb('DELETE /users/:userId/repairs/:RepairId - it should not allow user to delete repair belongs to other user - Method 1', (t) => {
  request
    .delete(`/users/${userId}/repairs/${secondaryRepairId}`)
    .set('Authorization', userToken)
    .expect(401, t.end);
});

test.cb('DELETE /users/:userId/repairs/:RepairId - it should not allow user to delete repair belongs to other user - Method 2', (t) => {
  request
    .delete(`/users/${secondaryUserId}/repairs/${secondaryRepairId}`)
    .set('Authorization', userToken)
    .expect(401, t.end);
});


test.cb('DELETE /users/:userId/repairs/:RepairId - it should allow admin to delete repair belongs to a user', (t) => {
  request
    .delete(`/users/${secondaryUserId}/repairs/${secondaryRepairId}`)
    .set('Authorization', adminToken)
    .expect(204, t.end);
});
