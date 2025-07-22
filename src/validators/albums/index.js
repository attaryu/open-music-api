const { AlbumPayloadSchema } = require('./schema');
const { AlbumCreatePayloadError } = require('./error');

const AlbumValidator = {
	validateAlbumPayload: (data) => {
		const validationResult = AlbumPayloadSchema.validate(data);

		if (validationResult.error) {
			throw new AlbumCreatePayloadError(validationResult.error.message);
		}
	},
};

module.exports = AlbumValidator;
