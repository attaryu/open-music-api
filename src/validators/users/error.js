const ClientError = require('../../exceptions/client-error');

class UserPayloadError extends ClientError {
  constructor(message) {
    super(message);
    this.name = 'UserPayloadError';
  }
}

module.exports = { UserPayloadError };
