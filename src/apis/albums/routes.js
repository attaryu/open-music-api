const path = require('path');

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
	},
	{
		method: 'POST',
		path: '/albums/{id}/covers',
		handler: (header, h) => handler.postAlbumCoverHandler(header, h),
		options: {
			payload: {
				output: 'stream',
				multipart: true,
				allow: 'multipart/form-data',
				maxBytes: 512000,
			},
		},
	},
	{
		method: 'GET',
		path: '/albums/{id}/covers/{params*}',
		handler: {
			directory: {
				path: path.resolve('public', 'covers'),
			},
		},
	},
];

module.exports = routes;
