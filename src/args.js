const _ = require('lodash');

const handlers = [];
function addBeforeValueHandler(options, fn) {
    handlers.push({ options, fn });
}

function executeBeforeValueHandlers(value, contexts) {
    let result = value;
    const context = Object.assign({}, ...contexts);
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

function processValueInternal(value, contexts) {
    if (_.isFunction(value)) {
        return value;
    }
    if (isTable(value)) {
        value.rawTable = _.cloneDeep(value).rawTable.map(v => processValueInternal(v, contexts));
        return value;
    }
    if (_.isArray(value)) {
        return value.map(v => processValueInternal(v, contexts));
    }
    if (_.isObject(value)) {
        return _.mapValues(value, v => processValueInternal(v, contexts));
    }
    return executeBeforeValueHandlers(value, contexts);
}

function processValue(value, ...contexts) {
    return processValueInternal(value, contexts);
}

module.exports = {
    processValue,
    addBeforeValueHandler
};
