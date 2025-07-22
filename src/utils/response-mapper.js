module.exports = {
  /**
   * @param {Object} payload
   * @returns {Object}
   */
  success: (payload) => {
    const defaultResponse = {
      status: 'success',
    };

    if (typeof payload === 'string') {
      return { ...defaultResponse, message: payload };
    }

    return { ...defaultResponse, data: payload };
  },

  /**
   * @param {string} message 
   * @returns {Object}
   */
  fail: (message) => {
    return {
      status: 'fail',
      message,
    };
  },
};
