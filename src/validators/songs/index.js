const { SongPayloadSchema, SongQueryParametersSchema } = require('./schema');
const { SongPayloadError, SongQueryParameterError } = require('./error');

const SongValidator = {
	validateSongPayload: (data) => {
		const validationResult = SongPayloadSchema.validate(data);

		if (validationResult.error) {
			throw new SongPayloadError(validationResult.error.message);
		}
	},

	/**
	 * @param {{ title?: string, performer?: string }} query
	 */
	validateSongQueryParameters: (query) => {
		const validationResult = SongQueryParametersSchema.validate(query);

		if (validationResult.error) {
			throw new SongQueryParameterError(validationResult.error.message);
		}
	},
};

module.exports = SongValidator;
