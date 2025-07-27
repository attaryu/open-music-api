/**
 * @param {import('./handler')} handler 
 * @returns {import('hapi').ServerRoute[]}
 */
const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: (header, h) => handler.postAlbumHandler(header, h),
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: (header) => handler.getAlbumHandler(header),
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: (header) => handler.putAlbumHandler(header),
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: (header) => handler.deleteAlbumHandler(header),
  }
];

module.exports = routes;
