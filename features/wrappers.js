const { setDefinitionFunctionWrapper } = require('cucumber');
const config = require('../src/config');
const { processStepDefinition, executeBeforeSteps, executeAfterSteps } = require('../src/steps');
const { processArguments } = require('../src/args');
const context = require('../src/context');

/**
 * @private
 * Executes the given step definition and provides the
 * appropriate wrapping to handle callbacks and promises.
 * @param {function} fn The step definition function.
 */
function executeStepDefinition(fn) {
    return async function step(...initialArgs) {
        const args = processArguments(initialArgs);
        let result = undefined;
        let exception = undefined;
        if (context.isRunning && !fn.__nostep) {
            await executeBeforeSteps(this, args); // code to run before the step.
        }
        // execute the step definition.
        try {
            const step = processStepDefinition(fn, args);
            result = await step.apply(this, args);
            // capture and return the result in case the hook or step wants to skip the test.
            return result;
        }
        catch (err) {
            exception = err;
            throw err;
        }
        finally {
            if (context.isRunning && !fn.__nostep) {
                await executeAfterSteps(this, args, exception, result); // code to run after the step.
            }
        }
        return result;
    };
}

setDefinitionFunctionWrapper(fn => function step(...args) {
    const result = executeStepDefinition(fn).apply(this, args);
    // if "fn" was a callback, use the callback function to handle the result.
    if (args.length === fn.length) {
        result
            .then(r => args[args.length - 1](null, r))
            .catch(e => args[args.length - 1](e));
        return;
    }
    return result;
});
