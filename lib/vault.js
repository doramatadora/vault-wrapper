'use strict';
const https = require('https');
const fetch = require('node-fetch');
const debug = require('debug');
const _set = require('lodash.set');
const { slash, matchArray, toObjectPath, countLevels } = require('./path-utils');

const agent = new https.Agent({keepAlive: true});

class Vault {
    constructor (host, token, { depth, exclude }) {
        this.host = slash.trim.right(host);
        this.token = token;

        this.depth = depth;
        this.exclude = exclude;
    }

    fetchOptions (method) {
        return {
            method,
            headers: {
                'X-Vault-Token': this.token
            },
            agent,
            timeout: 10000
        };
    }

    doFetch (method, path) {
        let url = `${this.host}/${slash.trim.edges(path) || ''}`;
        return fetch(url, this.fetchOptions(method)).then(v => v.json()).catch(() => null);
    }

    async fetchNode (path) {
        const requests = [ this.doFetch('LIST', path), this.doFetch('GET', path) ];
        const response = await Promise.all(requests);

        const { data } = response.filter(r => r && !r.errors && !!r.data).shift() || {};

        return data;
    }

    async fetchAllFrom (path = '') {
        if(matchArray(this.excluded, path) || this.tooDeep(path)) {
            return null;
        }

        this.requests++;

        debug('vault-fetch')(`[${this.responses} / ${this.requests} complete] Queuing ${path}`);
        
        let data = await this.fetchNode(path);
        this.responses++;

        if(!data) {
            return null;
        }

        if(!data.keys) {
            _set(this.results, toObjectPath(path), data);
        } else {
            let promises = data.keys.map(node => this.fetchAllFrom(`${path}/${slash.trim.edges(node)}`));
            await Promise.all(promises);
        }

    }

    async fetchTree (root = '') {
        this.requests = 0;
        this.responses = 0;
        this.results = {};
        await this.fetchAllFrom(root);
        return this.results;
    }

    tooDeep (path) {
        return this.depth && countLevels(path) > this.depth;
    }
};

module.exports = {
    Vault
};
