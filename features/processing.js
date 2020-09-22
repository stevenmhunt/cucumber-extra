const { BeforeValue } = require('../index');
const { processTypes, stripHiddenSpaces } = require('../src/types');
const { processTemplates } = require('../src/templates');
const config = require('../src/config');

if (config.types.enabled) {
    BeforeValue(processTypes);
}

if (config.types.stripHiddenSpaces) {
    BeforeValue(stripHiddenSpaces);
}

if (config.templates.enabled) {
    BeforeValue(function hook(value) {
        return processTemplates(value, this);
    });
}