const ClientError = require('../../exceptions/client-error');

class SongPayloadError extends ClientError {
	constructor(message) {
		super(message, 400);
		this.name = 'SongPayloadError';
	}
}

class SongQueryParameterError extends ClientError {
	constructor(message) {
		super(message, 400);
		this.name = 'SongQueryParameterError';
	}
}

module.exports = { SongPayloadError, SongQueryParameterError };
