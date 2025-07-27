/**
 * @param {import('./handler')} handler 
 * 
 * @returns {import('hapi').ServerRoute[]}
 */
module.exports = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: (request, h) => handler.postAuthenticationHandler(request, h),
  },
];
