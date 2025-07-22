const db = require('../../databases/connection');
const generateId = require('../../utils/generate-id');

class AlbumsService {
  constructor() {
    this.db = db;
  }

  async createAlbum(albumData) {
    try {
      const result = await this.db.query(
        'INSERT INTO albums (id, name, year) VALUES ($1, $2, $3) RETURNING id',
        [`album-${generateId(16)}`, albumData.name, albumData.year]
      );

      return result.rows[0].id;
    } catch (error) {
      console.error('Error creating album:', error);
      throw error;
    }
  }
}

module.exports = AlbumsService;
