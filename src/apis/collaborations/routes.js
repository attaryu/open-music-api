/**
 * @param {import('./handler')} handler
 * @returns {import('@hapi/hapi').ServerRoute[]}
 */
module.exports = (handler) => [
	{
		method: 'POST',
		path: '/collaborations',
		handler: (request, h) => handler.postCollaborationHandler(request, h),
		options: { auth: 'openmusic_jwt' },
	},
	{
		method: 'DELETE',
		path: '/collaborations',
		handler: (request) => handler.deleteCollaborationHandler(request),
		options: { auth: 'openmusic_jwt' },
	},
];
