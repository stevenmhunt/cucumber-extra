const { addBeforeStepHandler, addAfterStepHandler } = require('./src/steps');
const timeout = 5000;

function BeforeStep(...args) {
    const options = args.length === 2 ? args[0] : { timeout };
    const fn = args.length === 2 ? args[1] : args[0];
    return addBeforeStepHandler(options, fn);
}

function AfterStep(...args) {
    const options = args.length === 2 ? args[0] : { timeout };
    const fn = args.length === 2 ? args[1] : args[0];
    return addAfterStepHandler(options, fn);
}

module.exports = {
    BeforeStep,
    AfterStep
};
