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
];

module.exports = routes;
