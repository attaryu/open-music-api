const db = require('../../databases/connection');
const generateId = require('../../utils/generate-id');

const NotFoundError = require('../../exceptions/not-found-error');

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

  async getAlbumById(albumId) {
    try {
      const result = await this.db.query('SELECT * FROM albums WHERE id = $1', [albumId]);

      if (result.rows.length === 0) {
        throw new NotFoundError('Album not found');
      }

      return result.rows[0] ?? null;
    } catch (error) {
      console.error('Error fetching album:', error);
      throw error;
    }
  }

  async updateAlbum(albumId, albumData) {
    try {
      const result = await this.db.query(
        'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
        [albumData.name, albumData.year, albumId]
      );

      if (result.rows.length === 0) {
        throw new NotFoundError('Album not found');
      }

      return result.rows[0].id;
    } catch (error) {
      console.error('Error updating album:', error);
      throw error;
    }
  }

  async deleteAlbum(albumId) {
    try {
      const result = await this.db.query('DELETE FROM albums WHERE id = $1 RETURNING id', [albumId]);

      if (result.rows.length === 0) {
        throw new NotFoundError('Album not found');
      }

      return result.rows[0].id;
    } catch (error) {
      console.error('Error deleting album:', error);
      throw error;
    }
  }
}

module.exports = AlbumsService;
