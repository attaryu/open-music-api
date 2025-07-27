/**
 * @param {import('./handler')} handler
 * @returns {import('@hapi/hapi').ServerRoute[]}
 */
module.exports = (handler) => [
	{
		method: 'POST',
		path: '/playlists',
		handler: (request, h) => handler.postPlaylistHandler(request, h),
		options: {
			auth: 'openmusic_jwt',
		},
	},
];
