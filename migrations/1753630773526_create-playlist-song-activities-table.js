const playlistIdConstraint =
	'fk_playlist_song_activities.playlist_id_playlists.id';
const songIdConstraint = 'fk_playlist_song_activities.song_id_songs.id';
const userIdConstraint = 'fk_playlist_song_activities.user_id_users.id';

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
	pgm.createType('playlist_song_activities_action', ['add', 'delete']);

	pgm.createTable('playlist_song_activities', {
		id: {
			type: 'VARCHAR(36)',
			primaryKey: true,
			default: pgm.func('gen_random_uuid()'),
		},
		playlist_id: {
			type: 'VARCHAR(25)',
			notNull: true,
		},
		song_id: {
			type: 'VARCHAR(21)',
			notNull: true,
		},
		user_id: {
			type: 'VARCHAR(22)',
			notNull: true,
		},
		action: {
			type: 'playlist_song_activities_action',
			notNull: true,
		},
		time: {
			type: 'TIMESTAMPTZ',
			default: pgm.func('CURRENT_TIMESTAMP'),
		},
	});

	pgm.addConstraint('playlist_song_activities', playlistIdConstraint, {
		foreignKeys: {
			columns: 'playlist_id',
			references: 'playlists(id)',
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
		},
	});

	pgm.addConstraint('playlist_song_activities', songIdConstraint, {
		foreignKeys: {
			columns: 'song_id',
			references: 'songs(id)',
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
		},
	});

	pgm.addConstraint('playlist_song_activities', userIdConstraint, {
		foreignKeys: {
			columns: 'user_id',
			references: 'users(id)',
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
	pgm.dropConstraint('playlist_song_activities', playlistIdConstraint);
	pgm.dropConstraint('playlist_song_activities', songIdConstraint);
	pgm.dropConstraint('playlist_song_activities', userIdConstraint);
	pgm.dropTable('playlist_song_activities');
	pgm.dropType('playlist_song_activities_action');
};
