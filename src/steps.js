const _ = require('lodash');
const { promisify } = require('es6-promisify');
const { pickle } = require('./context');

const beforeStepHandlers = [];
const afterStepHandlers = [];

function processStepDefinition(fn, args) {
    if (!args) {
        return fn.length === 2 ? promisify(fn) : fn;
    }
    if (args.length > 0 && fn.length === args.length) {
        const result = promisify(fn);
        return result;
    }
    return fn;
}

function addBeforeStepHandler(options, fn) {
    beforeStepHandlers.push({ options, fn });
}

function addAfterStepHandler(options, fn) {
    afterStepHandlers.unshift({ options, fn });
}

function executeBeforeSteps(context, args) {
    let promises = Promise.resolve();
    beforeStepHandlers.forEach((handler) => {
        promises = promises.then(() => processStepDefinition(handler.fn).call(context, { pickle, args }));
    });
    return promises;
}

function executeAfterSteps(context, args, err, result) {
    let promises = Promise.resolve();
    afterStepHandlers.forEach((handler) => {
        promises = promises.then(() => processStepDefinition(handler.fn).call(context, { pickle, args, err, result }));
    });
    return promises;
}

module.exports = {
    processStepDefinition,
    addBeforeStepHandler,
    addAfterStepHandler,
    executeBeforeSteps,
    executeAfterSteps
}