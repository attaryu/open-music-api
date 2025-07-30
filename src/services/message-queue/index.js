const amqp = require('amqplib');

const MessageQueueService = {
	/**
	 * @param {string} queue 
	 * @param {unknown} message 
	 * 
	 * @returns {Promise<void>}
	 */
	async addToQueue(queue, message) {
		const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
		const channel = await connection.createChannel();
		await channel.assertQueue(queue, { durable: true });

		channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

		setTimeout(() => connection.close(), 1000);
	},
};

module.exports = MessageQueueService;
