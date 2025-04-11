const config = require('@config');
const { Redis } = require('ioredis');
const { Worker, Queue, Job } = require('bullmq');
const logger = require('@library/logger');

const configConnection = config.redis;
configConnection.maxRetriesPerRequest = null;

const redisConnection = new Redis(configConnection);
const activeWorkers = new Map();
const queueSessionKey = 'session-queue';

/**
 * Creates and starts a worker for a specific session queue if it doesn't already exist.
 * 
 * @param {Object} params - The parameters for creating the worker.
 * @param {string} params.queue_name - The name of the queue for which the worker is created.
 * @param {Function} [params.process] - The function to process jobs in the queue. Defaults to logging the job start if not provided.
 * @param {Function} [params.callback_completed] - The callback executed when a job is completed. Defaults to logging the job completion if not provided.
 * @param {Function} [params.callback_failed] - The callback executed when a job fails. Defaults to logging the job failure if not provided.
 * 
 * @returns {Promise<Worker>}
 * 
 * @throws Will throw an error if `process`, `callback_completed`, or `callback_failed` are provided but not functions.
 */
const createQueueWorker = async (params) => {
    try {
        let { queue_name, process, callback_completed, callback_failed } = params;
        if (activeWorkers.has(queue_name)) {
            logger.info(`Worker for queue ${queue_name} is already running.`);
            return activeWorkers.get(queue_name);
        }

        // Function Worker
        if (process && typeof process !== 'function') {
            throw new Error('process is not a function');
        } else if (process == null) {
            process = (job) => {
                logger.info(`Job ID ${job.id} started.`, { payload: job.data });
            }
        }

        // Callback Completed
        if (callback_completed && typeof callback_completed !== 'function') {
            throw new Error('callback_completed is not a function');
        } else if (callback_completed == null) {
            callback_completed = (job) => {
                logger.info(`Job ID ${job.id} completed.`, { payload: job.data });
            }
        }

        // Callback Failed
        if (callback_failed && typeof callback_failed !== 'function') {
            throw new Error('callback_failed is not a function');
        } else if (callback_failed == null) {
            callback_failed = (job, error) => {
                logger.error(`Job ID ${job.id} failed.`, { payload: job.data, error });
            }
        }

        const worker = new Worker(
            queue_name,
            process,
            { connection: redisConnection }
        );

        worker.on('failed', callback_failed);
        worker.on('completed', callback_completed);

        activeWorkers.set(queue_name, worker);
        logger.info(`Worker for queue "${queue_name}" started listening.`);
        return worker;
    } catch (error) {
        throw error;
    }
};

/**
 * Stops and removes the worker for a specific session queue.
 *
 * @param {string} queueName - The name of the queue for which the worker should be stopped.
 *
 * @returns {Promise<void>}
 *
 * @throws Will throw an error if there are issues accessing or modifying the worker or active queue set.
 */
const stopQueueWorker = async (queueName) => {
    try {
        const worker = activeWorkers.get(queueName);
        if (worker) {
            worker.close();
            activeWorkers.delete(queueName);
            logger.info(`Worker for queue "${queueName}" stopped listening.`);
        }
    } catch (error) {
        throw error;
    }
};

/**
 * Sends a message to a worker on a specific queue.
 *
 * @param {string} queueName - The name of the queue to which the message should be sent.
 * @param {object} data - The data to be sent.
 * @param {object} options - The options queue
 *
 * @returns {Promise<Job>}
 *
 * @throws Will throw an error if there are issues accessing or modifying the queue.
 */
const sendMessageToWorker = async (queueName, data, options) => {
    try {
        const defaultOptions = {
            defaultJobOptions: {
                removeOnComplete: true,
                removeOnFail: 100,
            },
            ...options,
        }
        const myQueue = new Queue(queueName, {
            connection: redisConnection,
            ...defaultOptions,
        });
        return await myQueue.add(queueName, data);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    redisConnection,
    createQueueWorker,
    stopQueueWorker,
    activeWorkers,
    sendMessageToWorker,
    queueSessionKey,
};
