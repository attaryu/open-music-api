const Joi = require('joi');

const title = Joi.string().max(255);
const performer = Joi.string().max(255);

const SongPayloadSchema = Joi.object({
	title: title.required(),
	year: Joi.number()
		.integer()
		.min(1900)
		.max(new Date().getFullYear())
		.required(),
	genre: Joi.string().max(50).required(),
	performer: performer.required(),
	duration: Joi.number().integer().min(0).allow(null),
	albumId: Joi.string().max(36).allow(null),
});

const SongQueryParametersSchema = Joi.object({
	title: title.optional(),
	performer: performer.optional(),
});

module.exports = { SongPayloadSchema, SongQueryParametersSchema };
