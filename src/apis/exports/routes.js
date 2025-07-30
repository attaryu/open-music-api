/**
 * @param {import('./handler')} handler
 * @returns {import('hapi').ServerRoute[]}
 */
module.exports = (handler) => [
	{
		method: 'POST',
		path: '/export/playlists/{id}',
		handler: (request, h) => handler.postExportPlaylistHandler(request, h),
		options: { auth: 'openmusic_jwt' },
	},
];
