const _ = require('lodash');

const handlers = [];
function addBeforeValueHandler(options, fn) {
    handlers.push({ options, fn });
}

function executeBeforeValueHandlers(context, value) {
    let result = value;
    handlers.forEach(({ options, fn }) => {
        try {
            const v = fn.call(context, result);
            if (v !== undefined || (options && options.allowUndefined)) {
                result = v;
            }
        }
        catch (err) {
            // we don't care about transform errors.
            // if something bad happens, don't break the test over it.
        }
    });
    return result;
}

const isTable = v => v.hashes && _.isFunction(v.hashes);

function processValueInternal(context, value) {
    if (_.isFunction(value)) {
        return value;
    }
    if (isTable(value)) {
        value.rawTable = _.cloneDeep(value).rawTable.map(v => processValueInternal(context, v));
        return value;
    }
    if (_.isArray(value)) {
        return value.map(v => processValueInternal(context, v));
    }
    if (_.isObject(value)) {
        return _.mapValues(value, v => processValueInternal(context, v));
    }
    return executeBeforeValueHandlers(context, value);
}

function processValue(context, args) {
    return processValueInternal(context, args);
}

module.exports = {
    processValue,
    addBeforeValueHandler
};
