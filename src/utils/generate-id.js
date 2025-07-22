const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
const generateId = (size = 16) => nanoid(size);

module.exports = generateId;
