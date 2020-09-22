
const { sleep } = require('wait-promise');
const { BeforeStep, AfterStep } = require('../index');
const config = require('../src/config');

if (config.steps.delay.before) {
    BeforeStep(() => sleep(config.steps.delay.before));
}
if (config.steps.delay.after) {
    AfterStep(() => sleep(r, config.steps.delay.after));
}