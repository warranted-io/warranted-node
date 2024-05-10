const axios = require('axios');
const FormData = require('form-data');
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
        this.host = 'https://app.warranted.io';
        this.headers = {};
    }

    setHost(host) {
        this.host = host;
    }

    setHeaders(headers) {
        this.headers = headers;
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

    decisions = {
        /**
         * Get details about a decision
         * @param {string} decisionId - the id of the decision to fetch
         * @returns {object} - Details at: http://app.warranted.io/docs/decisions
         */
        get: async (decisionId) => {
            if (!decisionId || !String(decisionId).startsWith('decision-')) {
                throw new Error('Invalid Decision Id. Must start with `decision-`');
            }
            const response = await axios({
                method: 'get',
                url: `${host}/api/v1/decisions/${decisionId}`,
                auth: {
                    username: this.accountId,
                    password: this.authToken,
                },
                headers: this.headers,
            });
            return response.data;
        },
    }

    lawEnforcementRequests = {
        /**
         * Get either a list of lawEnforcementRequests or one specific request
         * @param {object | string} options - Optional. If an object, it should contain either a `startAt` or `limit` parameter or both.
         * If a string it should be a `lawEnforcementRequestId`.
         * @returns {array | object} - Details at: http://app.warranted.io/docs/lawEnforcementRequests
         */
        get: async (options) => {
            let url = `${host}/api/v1/lawEnforcementRequests`;
            if (typeof options === 'string' || options instanceof String) {
                url += `/${options}`;
            } else if (typeof options === 'object' && !Array.isArray(options) && options !== null) {
                const params = new URLSearchParams();
                if (!isNaN(parseInt(options.startAt, 10))) {
                    params.append('startAt', String(parseInt(options.startAt, 10)));
                }
                if (!isNaN(parseInt(options.limit, 10))) {
                    params.append('limit', String(parseInt(options.limit, 10)));
                }
                url += `?${params.toString()}`;
            }
            const response = await axios({
                method: 'get',
                url,
                auth: {
                    username: this.accountId,
                    password: this.authToken,
                },
                headers: this.headers,
            });
            return response.data;
        },

        /**
         * Submit a new lawEnforcementRequest
         * @param {buffer} lawEnforcementRequestFile - a law enforcement request file as a buffer. Only pdfs are accepted.
         * @returns {object} - Details at: http://app.warranted.io/docs/lawEnforcementRequests
         */
        add: async (lawEnforcementRequestFile) => {
            const form = new FormData();
            form.append('lawEncforementRequest', lawEnforcementRequestFile);

            const response = await axios({
                method: 'post',
                url: `${host}/api/v1/lawEnforcementRequest/new`,
                auth: {
                    username: this.accountId,
                    password: this.authToken,
                },
                data: form,
                headers: this.headers,
            });
            return response.data;
        },

        /**
         * Update a lawEnforcementRequest
         * @param {object} lawEnforcementRequest - an updated law enforcement request object.
         * @returns {object} - Details at: http://app.warranted.io/docs/lawEnforcementRequests
         */
        update: async (lawEnforcementRequest) => {
            if (!lawEnforcementRequest.id) {
                throw new Error('id is missing');
            }
            const response = await axios({
                method: 'put',
                url: `${host}/api/v1/lawEnforcementRequests/${lawEnforcementRequest.id}`,
                auth: {
                    username: this.accountId,
                    password: this.authToken,
                },
                data: lawEnforcementRequest,
                headers: Object.assign({'Content-Type': 'application/json'}, this.headers),
            });
            return response.data;
        },

        /**
         * Delete a lawEnforcementRequest
         * @param {string} lawEnforcementRequestId - a law enforcement request id.
         * @returns {object} - Details at: http://app.warranted.io/docs/lawEnforcementRequests
         */
        delete: async (lawEnforcementRequestId) => {
            const response = await axios({
                method: 'delete',
                url: `${host}/api/v1/lawEnforcementRequests/${lawEnforcementRequestId}`,
                auth: {
                    username: this.accountId,
                    password: this.authToken,
                },
                headers: this.headers,
            });
            return response.data;
        }
    }

    me = {
        /**
         * Get data about the current user
         * @returns {object} - Details at: http://app.warranted.io/docs/me
         */
        get: async () => {
            const response = await axios({
                method: 'get',
                url: `${host}/api/v1/me`,
                auth: {
                    username: this.accountId,
                    password: this.authToken,
                },
                headers: this.headers,
            });
            return response.data;
        },
    }

    schema = {
        /**
         * Get the schema
         * @returns {object} - Details at: http://app.warranted.io/docs/schema
         */
         get: async () => {
            const response = await axios({
                method: 'get',
                url: `${host}/api/v1/schema`,
                auth: {
                    username: this.accountId,
                    password: this.authToken,
                },
                headers: this.headers,
            });
            return response.data;
        },

        /**
         * Update the schema
         * @param {object} schema - the updated schema
         * @returns {object} - Details at: http://app.warranted.io/docs/lawEnforcementRequests
         */
        update: async (schema) => {
            const response = await axios({
                method: 'put',
                url: `${host}/api/v1/schema`,
                auth: {
                    username: this.accountId,
                    password: this.authToken,
                },
                data:  schema,
                headers: Object.assign({'Content-Type': 'application/json'}, this.headers),
            });
            return response.data;
        },
    }
}


module.exports = client;