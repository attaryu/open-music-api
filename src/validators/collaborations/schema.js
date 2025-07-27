const Joi = require('joi');

const playlistIdSchema = Joi.string().required();
const userIdSchema = Joi.string().required();

const PostCollaborationsPayloadSchema = Joi.object({
	playlistId: playlistIdSchema,
	userId: userIdSchema,
});

const DeleteCollaborationPayloadSchema = Joi.object({
	playlistId: playlistIdSchema,
	userId: userIdSchema,
});

module.exports = {
	PostCollaborationsPayloadSchema,
	DeleteCollaborationPayloadSchema,
};
