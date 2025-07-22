const ClientError = require('../../exceptions/client-error');

class SongPayloadError extends ClientError {
	constructor(message) {
		super(message, 400);
		this.name = 'SongPayloadError';
	}
}

module.exports = { SongPayloadError };
