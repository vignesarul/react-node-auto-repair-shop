class InvalidInput extends Error {
  constructor(message) {
    super(message);
    this.message = 'Invalid Input';
    this.detail = message;
    this.name = this.constructor.name;
    this.statusCode = 400;
  }
}

module.exports = InvalidInput;
