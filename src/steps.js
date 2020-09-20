const _ = require('lodash');
const { promisify } = require('es6-promisify');
const context = require('./context');

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

function executeBeforeSteps(cnx) {
    let result = Promise.resolve();
    beforeStepHandlers.forEach((handler) => {
        result = result.then(() => processStepDefinition(handler.fn).call(cnx, context));
    });
    return result;
}

function executeAfterSteps(cnx) {
    let result = Promise.resolve();
    afterStepHandlers.forEach((handler) => {
        result = result.then(() => processStepDefinition(handler.fn).call(cnx, context));
    });
    return result;
}

module.exports = {
    processStepDefinition,
    addBeforeStepHandler,
    addAfterStepHandler,
    executeBeforeSteps,
    executeAfterSteps
}