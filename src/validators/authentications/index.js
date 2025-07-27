const { AuthenticationPayloadError } = require('./error');
const {
	PostAuthenticationPayloadSchema,
	PutAuthenticationPayloadSchema,
	DeleteAuthenticationPayloadSchema,
} = require('./schema');

const AuthenticationValidator = {
	validatePostAuthenticationPayload: (data) => {
		const validationResult = PostAuthenticationPayloadSchema.validate(data);

		if (validationResult.error) {
			throw new AuthenticationPayloadError(validationResult.error.message);
		}
	},
	validatePutAuthenticationPayload: (data) => {
		const validationResult = PutAuthenticationPayloadSchema.validate(data);

		if (validationResult.error) {
			throw new AuthenticationPayloadError(validationResult.error.message);
		}
	},
	validateDeleteAuthenticationPayload: (data) => {
		const validationResult = DeleteAuthenticationPayloadSchema.validate(data);

		if (validationResult.error) {
			throw new AuthenticationPayloadError(validationResult.error.message);
		}
	},
};

module.exports = AuthenticationValidator;
