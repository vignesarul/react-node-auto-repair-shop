class Forbidden extends Error {
  constructor(message) {
    super(message);
    this.message = 'Forbidden';
    this.detail = message;
    this.name = this.constructor.name;
    this.statusCode = 403;
  }
}

module.exports = Forbidden;
