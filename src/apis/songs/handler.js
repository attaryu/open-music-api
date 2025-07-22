class SongsHandler {
  /**
   * 
   * @param {import('../../services/postgres/songs-service')} service
   * @param {import('../../validators/songs')} validator
   * @param {import('../../utils/response-mapper')} response
   */
  constructor(service, validator, response) {
    this._service = service;
    this._validator = validator;
    this._response = response;
  }

  /**
   * @param {import('@hapi/hapi').Request} request
   * @param {import('@hapi/hapi').ResponseToolkit} h
   */
  async postSongsHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const songId = await this._service.createSong(request.payload);

    return h
      .response(this._response.success('Song created successfully', { songId }))
      .code(201);
  }
}

module.exports = SongsHandler;
