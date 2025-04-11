const { Kafka } = require('kafkajs');
const config = require('@config');
const logger = require('@library/logger');

const kafka = new Kafka({
    clientId: config.server.name,
    brokers: [`${config.kafka.host}:${config.kafka.port}`],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: config.kafka.group_id });

const connectKafka = async () => {
    await producer.connect();
    await consumer.connect();
    logger.info('Kafka connected');
};

const publish = async (topic, payload) => {
    const message = {
        value: JSON.stringify(payload),
    };
    try {
        const result = await producer.send({
            topic: topic,
            messages: [message],
        });
        logger.info('Published message', { result });
    } catch (error) {
        logger.error('Error publish message', { error });
    }
};

const subscribe = async (topicWithHandler) => {
    try {
        for (const topic in topicWithHandler) {
            await consumer.subscribe({ topic, fromBeginning: false });
            logger.info(`Subscribed to topic: ${topic}`);
        }

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const decodedMessage = message.value.toString();
                try {
                    await topicWithHandler[topic]?.(decodedMessage);
                } catch (err) {
                    logger.error('Error in handler execution', { error: err });
                }
            },
        });
    } catch (error) {
        logger.error('Error adding listener', { error });
    }
};


const disconnectKafka = async () => {
    await producer.disconnect();
    await consumer.disconnect();
    logger.info('Kafka disconnected');
};

module.exports = {
    connectKafka,
    disconnectKafka,
    publish,
    subscribe,
};
