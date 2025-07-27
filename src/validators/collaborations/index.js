const { PostCollaborationsPayloadSchema } = require('./schema');
const { CollaborationsPayloadError } = require('./error');

const CollaborationsValidator = {
	validatePostCollaborationPayload: (data) => {
		const validationResult = PostCollaborationsPayloadSchema.validate(data);

		if (validationResult.error) {
			throw new CollaborationsPayloadError(validationResult.error.message);
		}
	},
};

module.exports = CollaborationsValidator;
