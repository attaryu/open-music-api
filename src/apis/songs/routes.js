/**
 * @param {import('./handler')} handler
 */
module.exports = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: (request, h) => handler.postSongsHandler(request, h),
  }
]