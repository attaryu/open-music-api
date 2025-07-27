const Joi = require('joi');

const PostPlaylistPayloadSchema = Joi.object({
	name: Joi.string().required(),
});

const songIdSchema = Joi.string().required();

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
