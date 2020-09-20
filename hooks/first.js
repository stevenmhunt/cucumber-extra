const { BeforeAll, Before, After, AfterAll } = require('cucumber');
const config = require('../src/config');

const timeout = 1000;
const tags = config.alwaysEnabled ? null : '@extra';

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
