const { Before, After } = require('cucumber');
const config = require('../src/config');
const context = require('../src/context');

const timeout = 1000;
const tags = config.alwaysEnabled ? undefined : '@extra';

function lastBeforeHook({ pickle }) {
    console.log('===== last before');
    context.isRunning = true;
    context.pickle = pickle;
}
lastBeforeHook.__nostep = true;
Before({ timeout, tags }, lastBeforeHook);

function firstAfterHook({ pickle }) {
    context.isRunning = false;
    console.log('===== first after');
}
firstAfterHook.__nostep = true;
After({ timeout, tags }, firstAfterHook);
