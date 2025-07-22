/**
 * 
 * @param {import('./handler')} handler 
 * @returns 
 */
const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: (header, h) => handler.postAlbumHandler(header, h),
  },
  {
    method: 'GET',
    path: '/albums/{albumId}',
    handler: (header, h) => handler.getAlbumHandler(header, h),
  },
  {
    method: 'PUT',
    path: '/albums/{albumId}',
    handler: (header, h) => handler.putAlbumHandler(header, h),
  },
  {
    method: 'DELETE',
    path: '/albums/{albumId}',
    handler: (header, h) => handler.deleteAlbumHandler(header, h),
  }
];

module.exports = routes;
