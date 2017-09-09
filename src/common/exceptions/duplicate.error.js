class DuplicateRecord extends Error {
  constructor(message) {
    super(message);
    this.message = 'Resource already exists';
    this.detail = message;
    this.name = this.constructor.name;
    this.statusCode = 409;
  }
}

module.exports = DuplicateRecord;
