/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
	pgm.alterColumn('songs', 'id', {
		type: 'VARCHAR(36)',
		default: pgm.func('gen_random_uuid()'),
	});

  pgm.alterColumn('playlist_songs', 'song_id', {
    type: 'VARCHAR(36)',
    notNull: true,
  });

  pgm.alterColumn('playlist_song_activities', 'song_id', {
    type: 'VARCHAR(36)',
    notNull: true,
  })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
	pgm.alterColumn('songs', 'id', {
		type: 'VARCHAR(21)',
		notNull: true,
	});

  pgm.alterColumn('playlist_songs', 'song_id', {
    type: 'VARCHAR(21)',
    notNull: true,
  });

  pgm.alterColumn('playlist_song_activities', 'song_id', {
    type: 'VARCHAR(21)',
    notNull: true,
  });
};
