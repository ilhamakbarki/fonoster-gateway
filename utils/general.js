const config = require('@config');
const crypto = require('crypto');
const moment = require('moment-timezone');

function generateRandomString(length = 10, includeSymbols = false) {
    const alphaNumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const characters = includeSymbols ? alphaNumeric + symbols : alphaNumeric;

    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }

    return result;
}

/**
 * Splits an array into multiple smaller arrays (batches) of a specified size.
 *
 * @param {Array} arr - The array to be split into batches.
 * @param {number} [size=500] - The size of each batch. Defaults to 500.
 * @returns {Array[]} - An array containing the batches as sub-arrays.
 */

function createBatches(arr, size = 500) {
    const batches = [];
    for (let i = 0; i < arr.length; i += size) {
        batches.push(arr.slice(i, i + size));
    }
    return batches;
}

/**
 * Get array of objects that are not in target array by key.
 * @param {object[]} find - Array of objects to be filtered.
 * @param {string} keyFind - Key to be compared.
 * @param {object[]} target - Array of objects to be compared.
 * @param {string} keyTarget - Key to be compared.
 * @returns {object[]} - Array of objects that are not in target array.
 */
function getNotInAnotherObject(find, keyFind, target, keyTarget) {
    return find.filter(item1 => !target.some(s => s[keyTarget] == item1[keyFind]));
}

/**
 * Get array of objects that are in target array by key.
 * @param {object[]} find - Array of objects to be filtered.
 * @param {string} keyFind - Key to be compared.
 * @param {object[]} target - Array of objects to be compared.
 * @param {string} keyTarget - Key to be compared.
 * @returns {object[]} - Array of objects that are in target array.
 */
function getInAnotherObject(find, keyFind, target, keyTarget) {
    return find.filter(item1 => target.some(s => s[keyTarget] == item1[keyFind]));
}

const sleep = (seconds) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

const hashData = (data, digest = 'hex') => {
    const payloadString = JSON.stringify(data);
    return crypto
        .createHash('sha256')
        .update(payloadString, 'utf8')
        .digest(digest);
}

/**
 * Converts a buffer to a base64 encoded image string.
 * @param {Buffer} buffer - The buffer containing image data.
 * @returns {Buffer} - A base64 encoded string representing the image.
 */

const getImageFromBuffer = (buffer) => {
    try {
        const parseJson = JSON.parse(buffer.toString());
        if (parseJson.type === 'Buffer' && parseJson.data) {
            if (isBase64(parseJson.data)) {
                return getImageFromBuffer(Buffer.from(parseJson.data, 'base64'));
            } else {
                return getImageFromBuffer(Buffer.from(parseJson.data))
            }
        } else {
            throw new Error('Invalid buffer');
        }
    } catch (e) {
        return buffer;
    }
}
const isBase64 = (str) => {
    if (typeof str !== 'string') return false;
    const notBase64 = /[^A-Z0-9+\/=]/i;
    const isProperLength = str.length % 4 === 0;
    return isProperLength && !notBase64.test(str);
};

/**
 * Extract Message ID from Status Message ID.
 * Message ID format : <ephemeral_id>_<timestamp>_<random_id>
 * @param {string} data - Status Message ID.
 * @returns {string} - Message ID.
 */
const getMessageId = (data) => {
    try {
        const splitedId = data.split("_");
        for (const i of splitedId) {
            if (/^[0-9A-Fa-f]+$/.test(i)) {
                return i
            }
        }
        return data;
    } catch (error) {
        return data;
    }
}

/**
 * Converts a timestamp to a moment object.
 * @param {number} timestamp - Timestamp.
 * @returns {moment.Moment} - A moment object.
 */
const getCurrentTimestamp = (timestamp) => {
    try {
        if (timestamp > 978307200000) timestamp = timestamp / 1000
        return moment.unix(timestamp);
    } catch (error) {
        return moment();
    }
}

module.exports = {
    generateRandomString,
    createBatches,
    sleep,
    getNotInAnotherObject,
    getInAnotherObject,
    hashData,
    isBase64,
    getImageFromBuffer,
    getMessageId,
    getCurrentTimestamp,
};
