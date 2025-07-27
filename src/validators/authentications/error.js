const ClientError = require('../../exceptions/client-error');

class AuthenticationPayloadError extends ClientError {
	constructor(message) {
		super(message, 400);
		this.name = 'AuthenticationPayloadError';
	}
}

module.exports = { AuthenticationPayloadError };
