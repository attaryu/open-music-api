const ClientError = require('../../exceptions/client-error');

class AlbumCreatePayloadError extends ClientError {
  constructor(message) {
    super(message);
    this.name = 'AlbumCreatePayloadError';
  }
}

module.exports = { AlbumCreatePayloadError };

