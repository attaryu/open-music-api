const Joi = require('joi');

const AlbumCreateSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
});

module.exports = { AlbumCreateSchema };
