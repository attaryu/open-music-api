class AlbumHandler {
  /**
   * @param {import('../../services/postgres/albums-service')} service
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
    this._validator.validateAlbumPayload(request.payload);
    const albumId = await this._service.createAlbum(request.payload);

    return h.response(this._responseMapper.success(
      'Album created successfully',
      { albumId }
    )).code(201);
  }

  /**
   * @param {import('@hapi/hapi').Request} request
   * @param {import('@hapi/hapi').ResponseToolkit} h
   */
  async getAlbumHandler(request, h) {
    const { albumId } = request.params;

    const album = await this._service.getAlbumById(albumId);

    return h.response(this._responseMapper.success(
      'Album retrieved successfully',
      { album }
    )).code(200);
  }

  /**
   * @param {import('@hapi/hapi').Request} request
   * @param {import('@hapi/hapi').ResponseToolkit} h
   */
  async putAlbumHandler(request, h) {
    const { albumId } = request.params;
    this._validator.validateAlbumPayload(request.payload);

    const updatedAlbumId = await this._service.updateAlbum(albumId, request.payload);

    return h.response(this._responseMapper.success(
      'Album updated successfully',
      { albumId: updatedAlbumId }
    )).code(200);
  }

  /**
   * @param {import('@hapi/hapi').Request} request
   * @param {import('@hapi/hapi').ResponseToolkit} h
   */
  async deleteAlbumHandler(request, h) {
    const { albumId } = request.params;

    await this._service.deleteAlbum(albumId);

    return h.response(this._responseMapper.success(
      'Album deleted successfully'
    )).code(200);
  }
}

module.exports = AlbumHandler;
