const { addBeforeStepHandler, addAfterStepHandler } = require('./src/steps');
const { addBeforeValueHandler, processValue } = require('./src/args');
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
function BeforeValue(...args) {
    const options = args.length === 2 ? args[0] : { timeout };
    const fn = args.length === 2 ? args[1] : args[0];
    return addBeforeValueHandler(options, fn);
}

/**
 * Runs an object through the value processing system (type handling and templating).
 * @param {*} context The current scenario context.
 * @param {*} value The value to process.
 * @returns {*} the result.
 */
function getValue(context, value) {
    return processValue(context, value);
}

module.exports = {
    BeforeStep,
    AfterStep,
    BeforeValue
};
