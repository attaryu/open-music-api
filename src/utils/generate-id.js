const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

module.exports = (size = 16) => nanoid(size);
