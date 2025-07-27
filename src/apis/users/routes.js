/**
 * @param {import('./handler')} handler 
 * @returns {import('@hapi/hapi').ServerRoute[]}
 */
module.exports = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: (request, h) => handler.postUserHandler(request, h),
  },
];
