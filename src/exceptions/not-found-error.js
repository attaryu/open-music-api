const ClientError = require('./client-error');

class NotFoundError extends ClientError {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
