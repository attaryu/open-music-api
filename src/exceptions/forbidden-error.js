const ClientError = require('./client-error');

class ForbiddenError extends ClientError {
	constructor(message = 'Forbidden') {
		super(message);
		this.name = 'ForbiddenError';
		this.statusCode = 403;
	}
}

module.exports = ForbiddenError;
