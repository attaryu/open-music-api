// const songsAlbumIdConstraint = 'fk_songs.album_id_albums.id';
// const userAlbumsLikeAlbumIdConstraint =
// 	'fk_user_albums_like.album_id_albums.id';

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
	pgm.alterColumn('albums', 'id', {
		type: 'VARCHAR(36)',
		default: pgm.func('gen_random_uuid()'),
	});

	pgm.alterColumn('songs', 'album_id', { type: 'VARCHAR(36)' });

	// pgm.addConstraint('songs', songsAlbumIdConstraint, {
	// 	foreignKeys: {
	// 		columns: 'album_id',
	// 		references: 'albums(id)',
	// 		onDelete: 'CASCADE',
	// 		onUpdate: 'CASCADE',
	// 	},
	// });

	pgm.alterColumn('user_albums_like', 'album_id', {
		type: 'VARCHAR(36)',
		notNull: true,
	});

	// pgm.addConstraint('user_albums_like', userAlbumsLikeAlbumIdConstraint, {
	// 	foreignKeys: {
	// 		columns: 'album_id',
	// 		references: 'albums(id)',
	// 		onDelete: 'CASCADE',
	// 		onUpdate: 'CASCADE',
	// 	},
	// });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
	// pgm.dropConstraint('songs', songsAlbumIdConstraint);

	pgm.alterColumn('albums', 'id', {
		type: 'VARCHAR(22)',
		notNull: true,
	});

	pgm.alterColumn('songs', 'album_id', { type: 'VARCHAR(22)' });

	pgm.alterColumn('user_albums_like', 'album_id', {
		type: 'VARCHAR(22)',
		notNull: true,
	});
};
