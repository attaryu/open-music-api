/**
 * @param {import('./handler')} handler
 * @returns {import('@hapi/hapi').ServerRoute[]}
 */
module.exports = (handler) => [
	{
		method: 'POST',
		path: '/songs',
		handler: (request, h) => handler.postSongHandler(request, h),
	},
	{
		method: 'GET',
		path: '/songs',
		handler: (request) => handler.getSongsHandler(request),
	},
	{
		method: 'GET',
		path: '/songs/{id}',
		handler: (request) => handler.getSongHandler(request),
	},
	{
		method: 'PUT',
		path: '/songs/{id}',
		handler: (request) => handler.putSongHandler(request),
	},
	{
		method: 'DELETE',
		path: '/songs/{id}',
		handler: (request) => handler.deleteSongHandler(request),
	},
];
