# CucumberJS Extra
Extra tools and utilities for CucumberJS :cucumber:
- Manage CucumberJS profiles with a YAML file.
- `BeforeStep` and `AfterStep` hooks.
- Configurable step delays.

More coming soon!

<img alt="Can you not be extra for 10 minutes?" src="https://img.ifunny.co/images/11f611b03215913c50e0afdcbe321cbb201ab852771f766ef60484ff8e5add1f_1.jpg" width="200" />

## Installation
```bash
npm install cucumber-extra
```

## Configuration
1) Install `cucumber` in your project. This package references CucumberJS as a peer dependency. This package supports CucumberJS 5 and above.

2) Create a `cucumber.js` file in your project and set it to the following:
```javascript
module.exports = require('cucumber-extra');
```

3) Create a `cucumber-extra.yaml` file in your project.

## Profile Management
This package provides a concise way of managing one or more profiles in YAML, making it simple to keep track of step definition libraries, languages, formatters, and other configurable options in CucumberJS.

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
You can define one or more profiles here, and then use the `--profile <name>` flag to specify it when you run CucumberJS.

For more information on CucumberJS command-line parameters, review [the CucumberJS CLI documentation](https://github.com/cucumber/cucumber-js/blob/master/docs/cli.md).

## Hooks
Older versions of CucumberJS support the `BeforeStep` and `AfterStep` hooks, but the newer versions of the framework do not. These hooks provide the scenario context as `this` and also contain the `pickle` object from the current scenario (if applicable). They are implemented within CucumberJS using `setDefinitionFunctionWrapper`. There is also a wrapper available around all step definition arguments (including table fields and values) which allows you to transform that data during a running test, and can be accessed using the `BeforeValue` hook.
```javascript
const { BeforeStep, AfterStep } = require('cucumber-extra/hooks');

// runs before every step.
BeforeStep(function({ pickle, args }) {

});

// runs after every step.
AfterStep(function({ pickle, args, result }) {

});

// runs for every argument and table value.
BeforeValue(value => value);
```

## Step Delays

Add the following section to your `cucumber-extra.yaml` file:
```yaml
steps:
    # delay configuarion for steps.
    delay:
        # (default: 0) the number of milliseconds to wait before a step is executed.
        before: 1000
        # (default: 0) the number of milliseconds to wait after a step is executed.
        after: 1000
}
```
