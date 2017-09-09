class FacilityOccupied extends Error {
  constructor(message) {
    super(message);
    this.message = 'Facility Occupied';
    this.detail = message;
    this.name = this.constructor.name;
    this.statusCode = 409;
  }
}

module.exports = FacilityOccupied;
