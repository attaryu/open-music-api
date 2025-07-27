const { UserPayloadSchema } = require('./schema');
const { UserPayloadError } = require('./error');

const UserValidator = {
	validateUserPayload: (data) => {
		const validationResult = UserPayloadSchema.validate(data);

		if (validationResult.error) {
			throw new UserPayloadError(validationResult.error.message);
		}
	}
};

module.exports = UserValidator;
