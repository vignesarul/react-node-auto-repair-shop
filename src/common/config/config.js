module.exports = {
  server: {
    port: 3001,
    version: 'v1',
    status: 'test', // test || live
    host: 'http://localhost:3001/api/v1',
  },
  database: {
    uri: 'mongodb://localhost:27017/autorepair',
    table: '',
    validation: { runValidators: true, context: 'query' },
  },
  logger: {
    level: '',
  },
  secret: {
    passwordSalt: '123',
    jwtSignature: '123',
  },
  listing: {
    limit: 5,
  },
  mail: {
    sendgrid: {
      apiKey: '',
      templates: {
        newUser: {
          subject: 'Verify your account',
          templateId: '4a4cb1f4-bbff-4d52-89ff-0804e500ece9',
        },
        activeNewUser: {
          subject: 'New account details',
          templateId: 'ca92cef7-f790-4111-b72c-d7e686133c68',
        },
        forgotPassword: {
          subject: 'Password Reset',
          templateId: 'a0624261-3f89-495d-b60e-434e7a8e751a',
        },
        resetPassword: {
          subject: 'New Password',
          templateId: '50d9a559-2549-4a9d-9809-8aeeb2013754',
        },
      },
    },
    fromEmail: 'vignes.arul@gmail.com',
  },
};
