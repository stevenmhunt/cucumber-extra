const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const _ = require('lodash');
const resolvePath = require('resolve-path');
const { warn } = require('./logging');
const defaultConfig = require('../data/config.json');

let config = null;

function customizer(objValue, srcValue) {
    if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
    }
}

if (!config) {
    const dir = path.dirname(path.dirname(path.dirname(path.dirname(require.main.filename))));
    const filepath = resolvePath(dir, './cucumber-extra.yaml');
    if (fs.existsSync(filepath)) {
        const contents = fs.readFileSync(filepath, { encoding: 'utf8' });
        try {
            config = _.mergeWith({}, defaultConfig, yaml.safeLoad(contents), customizer);
            // override all profiles to ensure proper hook initialization order.
            _.values(config.profiles).forEach((profile) => {
                profile.require = [
                    "./node_modules/cucumber-extra/hooks/first.js",
                    "./features/**/*.js",
                    ...(profile.require || []),
                    "./node_modules/cucumber-extra/features/",
                    "./node_modules/cucumber-extra/hooks/last.js"
                ]
            });
        }
        catch (err) {
            warn(`Failed to load cucumber-extra.yaml: ${err.toString()}`);
        }
    }
    else {
        warn('No cucumber-extra.yaml file could be located.');
    }
}
module.exports = config;