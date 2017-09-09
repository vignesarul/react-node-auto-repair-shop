const validator = require('common/helpers/validator');
const dateConverter = require('common/helpers/dateConverter');
const exceptions = require('common/exceptions');
const Serializer = require('common/serializer');

const serializer = new Serializer();

class AccessController {
  /**
   * Initializes Access Controller
   *
   * @param: {
   *  model : model reference
   * }
   */
  constructor(model) {
    this.model = model;
    this.jsonSchema = model.getJsonSchema();
    this.performLogin = this.performLogin.bind(this);
    this.verifyAuth = this.verifyAuth.bind(this);
  }

  /**
   * Creates JWT token & stores its reference record in access model
   *
   * @param req
   * @param res
   * @param next
   */
  performLogin(req, res, next) {
    const body = { expiresAt: dateConverter.addDays({ count: 1, format: 'X' }).split('.')[0], userId: req.user._id.toString() };
    validator.buildParams({ input: body, schema: this.jsonSchema.postSchema })
      .then(input => validator.validate({ input, schema: this.jsonSchema.postSchema }))
      .then(input => this.model.createAccessLog(input))
      .then(input => this.model.createJwtToken(input))
      .then(result => {
        const userData = serializer.serialize(req.user, { type: 'user' });
        const loginData = serializer.serialize(result, { type: 'token' });
        loginData.includes = [userData];
        return res.send(loginData);
      })
      .catch(error => next(error));
  }

  /**
   * Validates the token sent in each request
   *
   * @param optional
   * @returns {function(*, *, *)}
   */
  verifyAuth(optional) {
    return (req, res, next) => {
      const input = req.headers.authorization;
      if (optional && !input) next();
      else if (!input) next(new exceptions.UnAuthorized());
      else {
        this.model.verifyToken(input)
          .then(result => (req.authToken = result))
          .then(() => next())
          .catch(error => next(error));
      }
    };
  }
}

module.exports = AccessController;
