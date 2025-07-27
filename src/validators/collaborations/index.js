const { CollaborationsPayloadError } = require('./error');
const {
	PostCollaborationsPayloadSchema,
	DeleteCollaborationPayloadSchema,
} = require('./schema');

const CollaborationsValidator = {
	validatePostCollaborationPayload: (data) => {
		const validationResult = PostCollaborationsPayloadSchema.validate(data);

		if (validationResult.error) {
			throw new CollaborationsPayloadError(validationResult.error.message);
		}
	},
	validateDeleteCollaborationPayload: (data) => {
		const validationResult = DeleteCollaborationPayloadSchema.validate(data);

		if (validationResult.error) {
			throw new CollaborationsPayloadError(validationResult.error.message);
		}
	},
};

module.exports = CollaborationsValidator;
