class AlbumHandler {
  /**
   * @param {import('../../services/spostgres/albums-service')} service
   * @param {import('../../validators/albums')} validator
   * @param {import('../../utils/response-mapper')} responseMapper
   */
  constructor(service, validator, responseMapper) {
    this._service = service;
    this._validator = validator;
    this._responseMapper = responseMapper;
  }

  /**
   * @param {import('@hapi/hapi').Request} request
   * @param {import('@hapi/hapi').ResponseToolkit} h
   */
  async postAlbumHandler(request, h) {
    this._validator.validateCreateAlbum(request.payload);
    const albumId = await this._service.createAlbum(request.payload);

    return h.response(this._responseMapper.success({ albumId })).code(201);
  }

  /**
   * @param {import('@hapi/hapi').Request} request
   * @param {import('@hapi/hapi').ResponseToolkit} h
   */
  async getAlbumHandler(request, h) {
    const { albumId } = request.params;

    const album = await this._service.getAlbumById(albumId);

    return h.response(this._responseMapper.success(album)).code(200);
  }
}

module.exports = AlbumHandler;
