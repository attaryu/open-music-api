const Joi = require('joi');

const PostAuthenticationPayloadSchema = Joi.object({
	username: Joi.string().max(100).required(),
	password: Joi.string().max(255).required(),
});

const refreshTokenSchema = Joi.string().required();

const PutAuthenticationPayloadSchema = Joi.object({
	refreshToken: refreshTokenSchema,
});

const DeleteAuthenticationPayloadSchema = Joi.object({
	refreshToken: refreshTokenSchema,
});

module.exports = {
	PostAuthenticationPayloadSchema,
	PutAuthenticationPayloadSchema,
	DeleteAuthenticationPayloadSchema,
};
