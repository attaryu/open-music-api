/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('authentications', {
		id: {
			type: 'VARCHAR(50)',
			primaryKey: true,
		},
		user_id: {
			type: 'VARCHAR(22)',
      notNull: true,
		},
		token: {
			type: 'text',
      notNull: true,
      unique: true,
		},
	});

  pgm.addConstraint('authentications', 'fk_authentications.user_id_users.id', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
  })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint('authentications', 'fk_users_id');
  pgm.dropTable('authentications');
};
