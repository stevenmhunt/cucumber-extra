const { setDefaultTimeout } = require('cucumber');
const { sleep } = require('wait-promise');
const { BeforeStep, AfterStep } = require('../index');
const config = require('../src/config');

const timeout = 1000;
const tags = config.alwaysEnabled ? null : '@extra';

if (config.timeouts.global) {
    setDefaultTimeout(config.timeouts.global);
}

if (config.steps.delay.before) {
    BeforeStep(() => sleep(config.steps.delay.before));
}
if (config.steps.delay.after) {
    AfterStep(() => sleep(r, config.steps.delay.after));
}