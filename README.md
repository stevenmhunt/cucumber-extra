# :cucumber: Cucumber.js Extra
Additional tools, utilities, and capabilities for [Cucumber.js](https://github.com/cucumber/cucumber-js).
- Manage all of your profiles with a YAML file (no more annoying CLI arguments!)
- Additional hooks including `BeforeStep`, `AfterStep`, and `BeforeValue`.
- Configurable delays and retry handling for steps.

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

## Future Plans
- Enhanced type system with support for booleans, string literals, and JSON.
- Template engine support (Handlebars, ES6 Dynamic Templates).
- Object change tracking and clean-up.
- Performance Monitoring and Reporting.