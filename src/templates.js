const Handlebars = require('handlebars');
const fillTemplate = require('es6-dynamic-template');
const expandTemplate = require('expand-template')();
const _ = require('lodash');
const config = require('../src/config');

const contexts = [];

function addContext(context, options) {
    contexts.push({ context, options });
}

const engines = {
    handlebars: (value, context) => {
        isHbs = _.isString(value) && value.indexOf('{{') >= 0 && value.indexOf('}}') >= 0;
        if (!isHbs) {
            return value;
        }
        const template = Handlebars.compile(value, { noEscape: config.templates.options.noEscape });
        return template(context);
    },
    es6: (value, context) => {
        isES6 = _.isString(value) && value.indexOf('${') >= 0 && value.indexOf('}') >= 0;
        if (!isES6) {
            return value;
        }
        return fillTemplate(value, context);
    },
    'expand-template': (value, context) => {
        return expandTemplate(value, context);
    }
};

function addEngine(name, fn) {
    engines[name] = fn;
}

function getContext(context) {
    return Object.assign({}, context || {}, ...contexts.map(i => i.context));
}

function processTemplates(value, context) {
    if (_.isFunction(engines[config.templates.engine])) {
        return engines[config.templates.engine](value, getContext(context));
    }
}

module.exports = {
    processTemplates,
    addContext,
    addEngine
};
