const Joi = require('joi');

const SongPayloadSchema = Joi.object({
	title: Joi.string().required(),
	year: Joi.number()
		.integer()
		.min(1900)
		.max(new Date().getFullYear())
		.required(),
	genre: Joi.string().required(),
	performer: Joi.string().required(),
	duration: Joi.number().integer().min(0).allow(null),
	albumId: Joi.string().allow(null),
});

const SongQueryParametersSchema = Joi.object({
	title: Joi.string().optional(),
	performer: Joi.string().optional(),
});

module.exports = { SongPayloadSchema, SongQueryParametersSchema };
