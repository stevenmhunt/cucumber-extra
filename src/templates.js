const Handlebars = require('handlebars');
const _ = require('lodash');
const config = require('../src/config');

const contexts = [];

function addContext(context, options = { scope: 'global' }) {
    contexts.push({ context, options });
}

const engines = {
    handlebars: (value, context) => {
        isHbs = _.isString(value) && value.indexOf('{{') >= 0 && value.indexOf('}}') >= 0;
        if (!isHbs) {
            return value;
        }
        const template = Handlebars.compile(value, { noEscape: config.templates.options.noEscape });
        return template(getContext(context));
    }
};

function addEngine(name, fn) {
    engines[name] = fn;
}

function getContext(context) {
    return Object.assign({}, context || {});
}

function processTemplates(value, context) {
    if (_.isFunction(engines[config.templates.engine])) {
        return engines[config.templates.engine](value, context);
    }
}

module.exports = {
    processTemplates,
    addContext,
    addEngine
};
