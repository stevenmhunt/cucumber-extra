const { BeforeAll, Before, After, AfterAll, setDefaultTimeout } = require('cucumber');
const { BeforeStep, AfterStep } = require('../hooks');
const config = require('../src/config');

const timeout = 1000;
const tags = config.alwaysEnabled ? null : '@extra';

if (config.timeouts.global) {
    setDefaultTimeout(config.timeouts.global);
}

BeforeAll({ timeout }, () => {
    console.log('===== first before all');
});

Before({ timeout, tags }, function hook({ pickle }) {
    console.log('===== first before');
});

After({ timeout, tags }, function hook({ pickle }) {
    console.log('===== last after');
});

AfterAll({ timeout }, () => {
    console.log('==== last after all');
});

if (config.steps.delay.before) {
    BeforeStep(() => new Promise(r => setTimeout(r, config.steps.delay.before)));
}
if (config.steps.delay.after) {
    AfterStep(() => new Promise(r => setTimeout(r, config.steps.delay.after)));
}