const { PlaylistsPayloadError } = require('./error');
const {
	PostPlaylistPayloadSchema,
	PostPlaylistSongPayloadSchema,
} = require('./schema');

const PlaylistsValidator = {
	validatePostPlaylistPayload: (data) => {
		const validationResult = PostPlaylistPayloadSchema.validate(data);

		if (validationResult.error) {
			throw new PlaylistsPayloadError(validationResult.error.message);
		}
	},
	validatePostPlaylistSongPayload: (data) => {
		const validationResult = PostPlaylistSongPayloadSchema.validate(data);

		if (validationResult.error) {
			throw new PlaylistsPayloadError(validationResult.error.message);
		}
	},
};

module.exports = PlaylistsValidator;
