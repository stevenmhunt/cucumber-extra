const { addBeforeStepHandler, addAfterStepHandler } = require('./src/steps');
const { addBeforeValueHandler } = require('./src/args');
const timeout = 5000;

/**
 * Adds a hook that runs before a step.
 * @param {json} options Configures timeouts and tag filters for the step hook.
 * @param {function} fn The hook function.
 */
function BeforeStep(...args) {
    const options = args.length === 2 ? args[0] : { timeout };
    const fn = args.length === 2 ? args[1] : args[0];
    return addBeforeStepHandler(options, fn);
}

/**
 * Adds a hook that runs after a step.
 * @param {json} options Configures timeouts and tag filters for the step hook.
 * @param {function} fn The hook function.
 */
function AfterStep(...args) {
    const options = args.length === 2 ? args[0] : { timeout };
    const fn = args.length === 2 ? args[1] : args[0];
    return addAfterStepHandler(options, fn);
}

/**
 * Adds a hook that runs before a value is processed.
 * Note: the specified hook *must* be synchronous and return the modified value.
 * @param {function} fn The hook function.
 */
function BeforeValue(fn) {
    return addBeforeValueHandler(fn);
}

module.exports = {
    BeforeStep,
    AfterStep,
    BeforeValue
};
