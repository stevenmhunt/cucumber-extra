const { Before, After } = require('cucumber');
const config = require('../src/config');
const context = require('../src/context');

const timeout = 1000;
const tags = config.alwaysEnabled ? null : '@extra';

function lastBeforeHook({ pickle }) {
    context.isRunning = true;
    context.pickle = pickle;
}
lastBeforeHook.__nostep = true; // prevents AfterStep hooks from running.
Before({ timeout, tags }, lastBeforeHook);

function firstAfterHook() {
    context.isRunning = false;
}
firstAfterHook.__nostep = true; // prevents BeforeStep hooks from running.
After({ timeout, tags }, firstAfterHook);
