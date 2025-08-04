const Joi = require('joi');

const PostPlaylistPayloadSchema = Joi.object({
	name: Joi.string().max(100).required(),
});

const songIdSchema = Joi.string().max(36).required();

const PostPlaylistSongPayloadSchema = Joi.object({
	songId: songIdSchema,
});

const DeletePlaylistSongPayloadSchema = Joi.object({
	songId: songIdSchema,
});

module.exports = {
	PostPlaylistPayloadSchema,
	PostPlaylistSongPayloadSchema,
	DeletePlaylistSongPayloadSchema,
};
