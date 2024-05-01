const { timingSafeEqual } = require('crypto');

/**
 * Function does a timesafe comparison
 * @param {string} a - the first string
 * @param {string} b - the second string
 * @returns {boolean} - true if they're equal, else false.
 */
function timeSafeCompare(a, b) {
    try {
        return timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
    } catch {
        return false;
    }
};

/**
 * Function to create HMAC of a JSON request
 * @param {string} url - the destination url
 * @param {string} jsonData - JSON request data
 * @param {string} secretKey - Secret key for HMAC
 * @param {string} algorithm - Hashing algorithm (e.g., 'sha256', 'sha512')
 * @returns {string} - HMAC value
 */
function createHMAC(url, jsonData, secretKey, algorithm = 'sha256') {
    const hmac = crypto.createHmac(algorithm, secretKey);
    hmac.update(url + jsonData);
    return hmac.digest('hex');
}

module.exports = {
    createHMAC,
    timeSafeCompare,
};