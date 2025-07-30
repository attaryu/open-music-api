const ClientError = require('../../exceptions/client-error');

class ExportPayloadError extends ClientError {
  constructor(message) {
    super(message);
    this.name = 'ExportPayloadError';
  }
}

module.exports = { ExportPayloadError };
