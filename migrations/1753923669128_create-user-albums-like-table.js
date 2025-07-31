const userIdConstraint = 'fk_user_albums_like.user_id_users.id';
const albumIdConstraint = 'fk_user_albums_like.album_id_albums.id';
const uniqueUserAlbumLikeConstraint = 'unique_user_album_like';

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
	pgm.createTable('user_albums_like', {
		id: {
			type: 'VARCHAR(36)',
			primaryKey: true,
			default: pgm.func('gen_random_uuid()'),
		},
		user_id: {
			type: 'VARCHAR(22)',
			notNull: true,
		},
		album_id: {
			type: 'VARCHAR(22)',
			notNull: true,
		},
	});

	pgm.createConstraint('user_albums_like', uniqueUserAlbumLikeConstraint, {
		unique: ['user_id', 'album_id'],
	});

	pgm.createConstraint('user_albums_like', userIdConstraint, {
		foreignKeys: {
			columns: 'user_id',
			references: 'users(id)',
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
		},
	});

	pgm.createConstraint('user_albums_like', albumIdConstraint, {
		foreignKeys: {
			columns: 'album_id',
			references: 'albums(id)',
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
		},
	});
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
	pgm.dropConstraint('user_albums_like', uniqueUserAlbumLikeConstraint);
	pgm.dropConstraint('user_albums_like', userIdConstraint);
	pgm.dropConstraint('user_albums_like', albumIdConstraint);

	pgm.dropTable('user_albums_like');
};
