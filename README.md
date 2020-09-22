# :cucumber: Cucumber.js Extra
Additional tools, utilities, and capabilities for [Cucumber.js](https://github.com/cucumber/cucumber-js).
- Manage all of your profiles with a YAML file (no more annoying CLI arguments!)
- Additional hooks including `BeforeStep`, `AfterStep`, and `BeforeValue`.
- Configurable delays and retry handling for steps.
- Enhanced type handling for step definition arguments.

Lots more extra coming soon!

<img alt="My friend: Can you not be extra for 10 minutes? Me 11 minutes later (bird in a vegetable costume)" src="https://img.ifunny.co/images/11f611b03215913c50e0afdcbe321cbb201ab852771f766ef60484ff8e5add1f_1.jpg" width="300" />

## Installation and Setup
1) Install `cucumber` and `cucumber-extra`:
```bash
npm install cucumber cucumber-extra --save
```
Note: Cucumber.js 5.0.0 and above is supported.

2) Create a `./cucumber.js` file in your project and set it to the following:
```javascript
module.exports = require('cucumber-extra/init');
```
If you already have a `./cucumber.js` file: Don't panic! You won't be needing it anymore :sunglasses:

3) Create a `./cucumber-extra.yaml` file in your project. You can configure *all the things* here (including those profiles you used to keep in the `./cucumber.js` file).

Congratulations on being extra! :tada:

## Simple Profile Management
This package provides a convinient way of managing one or more profiles in YAML, making it simple to keep track of step definition libraries, languages, formatters, and other configurable options in your test project.

Here is an example of configuring all possible command-line options through profiles. You can omit this section entirely or only add the parameters you wish to change:
```yaml
profiles:
    default:
        backtrace: false
        dryRun: false
        exit: false
        failFast: false
        format:
        - progress
        - summary
        formatOptions:
            option1: test
        language: ISO 639-1
        name: 
        noStrict: true
        order: defined
        parallel: 3
        require:
        - some/file.js
        - some/directory
        - some/glob/pattern/**/*.js
        requireModule:
        - module1
        - module2
        retry: 3
        retryTagFilter: "@retry"
        tags: "not @ignore"
        worldParameters:
            param1: test
    profile2:
        ...
```
You can define one or more profiles here, and then use the `--profile <name>` flag to specify it when you run `./node_modules/.bin/cucumber-js`. For more information on command-line parameters, review [the Cucumber.js CLI documentation](https://github.com/cucumber/cucumber-js/blob/master/docs/cli.md).

## Hooks
This package implements a step definition wrapper using `setDefinitionFunctionWrapper` in order to provide step-level hooks and the ability to modify step definition arguments at runtime. This wrapper is compatible with synchronous and asynchronous step definitions, and supports both callbacks and promises.

```javascript
const { BeforeStep, AfterStep, BeforeValue } = require('cucumber-extra');

// runs before every step.
BeforeStep(function({ pickle, args }) {
    // use `this` to reference the current scenario context here.    
});

// runs after every step.
AfterStep(function({ pickle, args, err, result }) {
    // use `this` to reference the current scenario context here.
});

// runs for every argument and table header and value.
// Example: make all step definition arguments upper case strings.
BeforeValue(value => `${value}`.toUpperCase());
```

## Step Delays and Retries

Add the following section to your `cucumber-extra.yaml` file:
```yaml
steps:
    delay:
        # (default: 0) the number of milliseconds to wait before a step is executed.
        before: 1000
        # (default: 0) the number of milliseconds to wait after a step is executed.
        after: 1000
    retry:
        # (default: 0) the number of times to attempt to retry a step or hook if it fails.        
        count: 3
        # (default: 0) the number of milliseconds to wait before retrying a step.
        delay: 1000
        # (default: 0) the number of milliseconds to add to the delay on each retry attempt.
        backoff: 2000
}
```

## Type Handling

Add the following section to your `cucumber-extra.yaml` file:
```yaml
types:
    # (default: true) whether or not type handling is enabled.
    enabled: true
    # the supported types.
    supported:
        # (default: true) convert number-like strings into numbers.
        numbers: true
        # (default: true) parse JSON strings into objects or arrays.
        json: true
        # (default: true) convert known keywords (null, true, false) into their literal values.
        keywords: true
        # (default: true) support for wrapping strings in single or double quotes.
        # Note: this allows you to specify whitespace strings inside of gherkin tables!
        literals: true
    # (default: true) remove any hidden or zero-width spaces.
    stripHiddenSpaces: true
```

## Templates
This package allows for all step definition parameters including tables to be processed through a templating engine, which allows for the scenario context and any other relevant sources of data to be referenced directly from the feature file. Common uses for this functionality include:
- Handling identifiers which change for every test
- Updating information based on data generated earlier in the scenario
- Creating more flexible and reusable step definitions

### Supported Engines
- handlebars - [Handlebars](https://www.npmjs.com/package/handlebars)
- es6 - [ES6 Dynamic Templates](https://www.npmjs.com/package/es6-dynamic-template)
- expand-template - [expand-template library](https://www.npmjs.com/package/expand-template)
- Custom engines

Add the following section to your `cucumber-extra.yaml` file:
```yaml
templates:
    # (default: true) whether or not to enable templates.
    enabled: true
    # (default: handlebars) which template engine to use.
    engine: handlebars
```
Using templating in a scenario:
```gherkin
Scenario: creating and then modifying an object
Given a "user" object is created in the system:
| name |
| Rob  |
When object "{{lastObject.id}}" is updated:
| name                   |
| {{lastObject.name}}ert |

```
Note: the scenario context `this` is automatically added to the template context.

Adding additional objects to the templating context:
```javascript
const { addContext } = require('cucumber-extra');

// load your config into the context to reuse commonly needed values
addContext(require('config'));

// add a context for the next scenario only.
addContext({ someValue1: 12345 }, { scope: 'scenario' });

```

Processing a value with the type and templating system:
```javascript
const { processValue } = require('cucumber-extra');
contexts = []; // additional context objects to add.
const value = getValue("{{someValue}}", ...contexts);
```

Adding a custom templating engine:
```javascript
const { addEngine } = require('cucumber-extra');

addEngine('custom-engine', (value) => {
    let result = value;
    // ... do something with the value.
    return result;
});
```
Template engines such as lodash templates and ejs are not supported out-of-the-box because they encourage the use of embedded javascript, which should be avoided if possible.

## Future Plans
- Object change tracking and clean-up.
- Performance Monitoring and Reporting.