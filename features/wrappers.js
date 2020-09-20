const { setDefinitionFunctionWrapper } = require('cucumber');
const config = require('../src/config');
const { processStepDefinition, executeBeforeSteps, executeAfterSteps } = require('../src/steps');
const context = require('../src/context');

function getStepResult(fn) {
    return async function step(...args) {
        if (context.isRunning && !fn.__nostep) {
            await executeBeforeSteps(this); // code to run before the step.
        }
        const result = await processStepDefinition(fn, args).apply(this, args); // execute the step definition.
        if (context.isRunning && !fn.__nostep) {
            await executeAfterSteps(this); // code to run after the step.
        }
        return result; // capture and return the result in case the hook or step wants to skip the test.
    };
}

setDefinitionFunctionWrapper(fn => function step(...args) {
    const result = getStepResult(fn).apply(this, args);
    // if "fn" was a callback, use the callback function to handle the result.
    if (args.length === fn.length) {
        result
            .then(r => args[args.length - 1](null, r))
            .catch(e => args[args.length - 1](e));
        return;
    }
    return result;
});
