const _ = require('lodash');

const handlers = [];
function addBeforeValueHandler(options, fn) {
    handlers.push({ options, fn });
}

function executeBeforeValueHandlers(value) {
    let result = value;
    handlers.forEach(({ options, fn }) => {
        result = fn(result);
    });
    return result;
}

const isTable = v => v.hashes && _.isFunction(v.hashes);

function processValue(value) {
    if (_.isFunction(value)) {
        return value;
    }
    if (isTable(value)) {
        value.rawTable = _.cloneDeep(value).rawTable.map(processValue);
        return value;
    }
    if (_.isArray(value)) {
        return value.map(processValue);        
    }
    if (_.isObject(value)) {
        return _.mapValues(value, processValue);
    }
    return executeBeforeValueHandlers(value);
}

function processArguments(args) {
    return processValue(args);
}

module.exports = {
    processArguments,
    addBeforeValueHandler
};
