const _ = require('lodash');
const config = require('../src/config');

const keywords = ['null', 'true', 'false'];

const isJsonString = value => (value.indexOf('{') >= 0 && value.indexOf('}') >= 0) ||
    (value.indexOf('[') >= 0 && value.indexOf(']') >= 0);

const isLiteral = value => _.isString(value) && (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'")));

function processTypes(value) {
    // check if the value is a known javascript keyword.
    if (config.types.supported.keywords && _.isString(value) && keywords.indexOf(value) >= 0) {
        return JSON.parse(value);
    }
    
    // check if the value might be a JSON string
    if (config.types.supported.json && _.isString(value) && isJsonString(value)) {
        return JSON.parse(value);
    }

    // handle string literals
    if (config.types.supported.literals && isLiteral(value)) {
        // https://stackoverflow.com/a/19156197/1267688
        return value.replace(/['"]+/g, '');
    }

    // check if empty string
    if (_.isString(value) && value === '') {
        return value;
    }

    // check if the value is a number
    if (config.types.supported.numbers && _.isString(value) && !isNaN(value)) {
        return parseFloat(value);
    }

    return value;
}

function stripHiddenSpaces(value) {
    if (_.isString(value)) {
        // https://stackoverflow.com/a/11305926/1267688
        return value.replace(/[\u200B-\u200D\uFEFF]/g, '');
    }
    return value;
}

module.exports = {
    processTypes,
    stripHiddenSpaces
};
