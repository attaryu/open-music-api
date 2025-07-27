const Joi = require('joi');

const AuthenticationPayloadSchema = Joi.object({
	username: Joi.string().required(),
	password: Joi.string().required(),
});

module.exports = { AuthenticationPayloadSchema };
