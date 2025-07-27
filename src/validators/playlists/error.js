const ClientError = require('../../exceptions/client-error');

class PlaylistsPayloadError extends ClientError {
	constructor(message) {
		super(message, 400);
		this.name = 'PlaylistsPayloadError';
	}
}

module.exports = { PlaylistsPayloadError };
