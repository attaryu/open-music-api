const connection = require('../../databases/connection');
const generateId = require('../../utils/generate-id');

class SongsService {
  constructor() {
    this.db = connection;
  }

  async createSong(songData) {
    try {
      const baseId = 'song-';

      const result = await this.db.query(
        'INSERT INTO songs (id, title, year, performer, genre, duration, album_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        // 21 based on database schema, 'id' is a VARCHAR(21)
        [
          baseId + generateId(21 - baseId.length),
          songData.title,
          songData.year,
          songData.performer,
          songData.genre,
          songData.duration ?? null,
          songData.albumId ?? null,
        ]
      );

      return result.rows[0].id;
    } catch (error) {
      console.error('Error creating song:', error);
      throw error;
    }
  }
}

module.exports = SongsService;
