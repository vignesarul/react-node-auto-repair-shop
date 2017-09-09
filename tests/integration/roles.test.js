import test from 'ava';
import jsf from 'json-schema-faker';
import supertest from 'supertest';
import { app, dbConnection } from 'server';
import roleSchema from 'schema/role';
import _ from 'lodash';
import config from 'common/config/config';

const request = supertest.agent(config.server.host);
const roleMock = jsf(roleSchema.postSchema);
let adminToken;
let adminId;
let roleId;

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

test.cb('it should allow admin to create a new role', (t) => {
  request
    .post('/roles')
    .type('json')
    .set('Authorization', adminToken)
    .send(roleMock)
    .expect('Content-Type', /json/)
    .expect(201)
    .then((res) => {
      t.deepEqual(_.pick(res.body.data[0].attributes, ['name', 'permissions', 'level']), _.pick(roleMock, ['name', 'permissions', 'level']));
      roleId = res.body.data[0].id;
      t.end();
    }).catch(err => console.log(err));
});
