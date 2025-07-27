const ClientError = require('./client-error');

class UnauthorizedError extends ClientError {
	constructor(message = 'Unauthorized access') {
		super(message);
		this.name = 'UnauthorizedError';
		this.statusCode = 401;
	}
}

module.exports = UnauthorizedError;
