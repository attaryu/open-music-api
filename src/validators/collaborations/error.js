const ClientError = require('../../exceptions/client-error');

class CollaborationsPayloadError extends ClientError {
	constructor(message) {
		super(message);
		this.name = 'CollaborationsPayloadError';
	}
}

module.exports = { CollaborationsPayloadError };
