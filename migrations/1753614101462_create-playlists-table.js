/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
	pgm.createTable('playlists', {
		id: {
			type: 'VARCHAR(25)',
			primaryKey: true,
		},
		name: {
			type: 'VARCHAR(100)',
			notNull: true,
		},
		owner: {
			type: 'VARCHAR(22)',
			notNull: true,
		},
	});

	pgm.addConstraint('playlists', 'fk_playlists.owner_users.id', {
		foreignKeys: {
			columns: 'owner',
			references: 'users(id)',
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
		},
	});

  pgm.createTable('playlist_songs', {
		id: {
			type: 'SERIAL',
			primaryKey: true,
		},
		playlist_id: {
			type: 'VARCHAR(25)',
			notNull: true,
		},
		song_id: {
			type: 'VARCHAR(21)',
			notNull: true,
		},
	});

  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlists.id', {
    foreignKeys: {
      columns: 'playlist_id',
      references: 'playlists(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
  });

  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.song_id_songs.id', {
    foreignKeys: {
      columns: 'song_id',
      references: 'songs(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlists.id');
  pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.song_id_songs.id');
  pgm.dropTable('playlist_songs');
  
  pgm.dropConstraint('playlists', 'fk_playlists.owner_users.id');
  pgm.dropTable('playlists');
};
