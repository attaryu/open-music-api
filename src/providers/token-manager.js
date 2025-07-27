const jwt = require('@hapi/jwt');
const BadRequestError = require('../exceptions/bad-request-error');

class TokenManager {
  /**
   * @param {string} userId 
   * @returns {string}
   */
  generateAccessToken(userId) {
    return jwt.token.generate({ userId }, process.env.ACCESS_TOKEN_KEY);
  }

  /**
   * @param {string} userId
   * @returns {string}
   */
  generateRefreshToken(userId) {
    return jwt.token.generate({ userId }, process.env.REFRESH_TOKEN_KEY);
  }

  /**
   * @param {string} token 
   * @returns {string}
   */
  verifyToken(token) {
    try {
      const artifact = jwt.token.decode(token);
      jwt.token.verify(artifact, process.env.REFRESH_TOKEN_KEY);

      return artifact.decoded.payload.userId;
    } catch {
      throw new BadRequestError('Invalid access token');
    }
  }
}

module.exports = TokenManager;
