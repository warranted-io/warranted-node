const { createHMAC, timeSafeCompare } = require('./cryptoHelper');

class client {
    /**
     * Warranted Client Constructor
     * @param {string} accountId - the account id
     * @param {string} authToken - the primary auth token
     */
    constructor(accountId, authToken) {
        if (!accountId) {
            throw new Error('No accountId provided');
        }
        if (!authToken) {
            throw new Error('No authToken provided');
        }
        this.accountId = accountId;
        this.authToken = authToken;
    }

    /**
     * Validate the signature of a request
     * @param {string} signature - the signature from the X-Warranted-Signature to compare against
     * @param {string} url - the url that received the request
     * @param {string} jsonData - JSON request data
     * @returns {boolean} - whether or not the signature matches
     */
    validateRequest(signature, url, body) {
        const hmac = createHMAC(url, body, this.authToken);
        return timeSafeCompare(signature, hmac);
    }
}


module.exports = client;