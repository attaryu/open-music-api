const { AuthenticationPayloadSchema } = require('./schema');
const { AuthenticationPayloadError } = require('./error');

const AuthenticationValidator = {
	validateAuthenticationPayload: (data) => {
		const validationResult = AuthenticationPayloadSchema.validate(data);

		if (validationResult.error) {
			throw new AuthenticationPayloadError(validationResult.error.message);
		}
	},
};

module.exports = AuthenticationValidator;
