const Handlebars = require('handlebars');
const _ = require('lodash');
const config = require('../src/config');

const isHbs = v => _.isString(v) && v.indexOf('{{') >= 0 && v.indexOf('}}') >= 0;

function getContext(context) {
    return Object.assign({}, context || {});
}

function processTemplates(context, value) {
    if (!isHbs(value)) {
        return value;
    }
    const template = Handlebars.compile(value, { noEscape: config.templates.options.noEscape });
    return template(getContext(context));
}

module.exports = {
    processTemplates
};
