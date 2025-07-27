/**
 * @param {import('./handler')} handler
 * @returns {import('@hapi/hapi').ServerRoute[]}
 */
module.exports = (handler) => [
	{
		method: 'POST',
		path: '/playlists',
		handler: (request, h) => handler.postPlaylistHandler(request, h),
		options: { auth: 'openmusic_jwt' },
	},
	{
		method: 'GET',
		path: '/playlists',
		handler: (request) => handler.getPlaylistsHandler(request),
		options: { auth: 'openmusic_jwt' },
	},
	{
		method: 'POST',
		path: '/playlists/{id}/songs',
		handler: (request, h) => handler.postPlaylistSongHandler(request, h),
		options: { auth: 'openmusic_jwt' },
	},
	{
		method: 'GET',
		path: '/playlists/{id}/songs',
		handler: (request, h) => handler.getPlaylistSongsHandler(request, h),
		options: { auth: 'openmusic_jwt' },
	},
	{
		method: 'DELETE',
		path: '/playlists/{id}/songs',
		handler: (request) => handler.deletePlaylistSongHandler(request),
		options: { auth: 'openmusic_jwt' },
	},
];
