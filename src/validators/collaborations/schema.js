const Joi = require('joi');

const playlistIdSchema = Joi.string().max(36).required();
const userIdSchema = Joi.string().max(36).required();

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
