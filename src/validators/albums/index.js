const { AlbumCreateSchema } = require('./schema');
const { AlbumCreatePayloadError } = require('./error');

const AlbumValidator = {
  validateCreateAlbum: (data) => {
    const validationResult = AlbumCreateSchema.validate(data);

    if (validationResult.error) {
      throw new AlbumCreatePayloadError(validationResult.error.message);
    }
  }
}

module.exports = AlbumValidator;
