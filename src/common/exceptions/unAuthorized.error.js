class UnAuthorized extends Error {
  constructor(message) {
    super(message);
    this.message = 'UnAuthorized';
    this.detail = message;
    this.name = this.constructor.name;
    this.statusCode = 401;
  }
}

module.exports = UnAuthorized;
