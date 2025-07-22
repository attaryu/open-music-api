module.exports = {
  /**
   * @param {Object} payload
   * @returns {Object}
   */
  success: (message, data) => ({
    status: 'success',
    message: message,
    data
  }),
  /**
   * @param {string} message 
   * @returns {Object}
   */
  fail: (message) => ({
    status: 'fail',
    message,
  }),
};
