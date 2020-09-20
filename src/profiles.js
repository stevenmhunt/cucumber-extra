const _ = require('lodash');
const config = require('./config');
const parameters = require('../data/parameters.json');

const escape = v => v.replace(/(['`\\])/g, '\\$1');

const paramTypes = {
    flag: (f, v) => v ? f : null,
    string: (f, v) => `${f} '${escape(v)}'`,
    number: (f, v) => `${f} ${v}`,
    json: (f, v) => `${f} '${escape(JSON.stringify(v))}'`,
    array: (f, v) => {
        const value = _.isArray(v) ? v : [v];
        return value.map(val => `${f} '${escape(val)}'`).join(' ');
    }
}

function processParameter(key, value) {
    const param = parameters[key];
    if (!param || !key || !value) {
        return null;
    }
    return paramTypes[param.type || 'flag'](param.flag, value);
}

function buildProfiles() {
    if (!config || !config.profiles) {
        return {};
    }

    const result = {};
    _.keys(config.profiles).forEach((key) => {
        result[key] = _.keys(config.profiles[key]).map(k => processParameter(k, config.profiles[key][k])).join(' ');
    });
    return result;
}

module.exports = {
    buildProfiles
};