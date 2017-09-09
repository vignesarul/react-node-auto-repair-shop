class InvalidFilterQuery extends Error {
  constructor(message) {
    super(message);
    this.message = 'Invalid Filter Query';
    this.detail = message;
    this.name = this.constructor.name;
    this.statusCode = 400;
  }
}

module.exports = InvalidFilterQuery;
