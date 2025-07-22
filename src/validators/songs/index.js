const { SongPayloadSchema } = require('./schema');
const { SongPayloadError } = require('./error');

const SongValidator = {
  validateSongPayload: (data) => {
    const validationResult = SongPayloadSchema.validate(data);

    if (validationResult.error) {
      throw new SongPayloadError(validationResult.error.message);
    }
  }
}

module.exports = SongValidator;
