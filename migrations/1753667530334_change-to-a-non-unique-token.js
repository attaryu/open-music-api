/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
	pgm.dropColumn('authentications', 'token');

	pgm.addColumn('authentications', {
		token: {
			type: 'text',
			notNull: true,
		},
	});
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
	pgm.dropColumn('authentications', 'token');

	pgm.addColumn('authentications', {
		token: {
			type: 'text',
			notNull: true,
			unique: true,
		},
	});
};
