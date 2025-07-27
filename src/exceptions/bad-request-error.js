const ClientError = require('./client-error');

class BadRequestError extends ClientError {
  constructor(message = 'Bad Request') {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;
