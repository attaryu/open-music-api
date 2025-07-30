const { PostExportPlaylistPayloadSchema } = require('./schema');
const { ExportPayloadError } = require('./error');

const ExportValidator = {
  validateExportPlaylistPayload: (data) => {
    const validationResult = PostExportPlaylistPayloadSchema.validate(data);

    if (validationResult.error) {
      throw new ExportPayloadError(validationResult.error.message);
    }
  }
};

module.exports = ExportValidator;
