# CucumberJS Extra
Extra tools and utilities for CucumberJS :cucumber:
- Manage CucumberJS profiles with a YAML file.
- `BeforeStep` and `AfterStep` hooks.
- Configurable step delays and retries.
- Templating and improved types for step definitions (including tables!)
- Object change tracking and clean-up.
- Performance monitoring and reporting.

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

To enable `cucumber-extra` in your feature file, either use the `@extra` tag on your scenarios or set `alwaysEnabled` setting to `true` in the `cucumber-extra.yaml` file.

## Profile Management
This package provides a concise way of managing one or more profiles in YAML, making it simple to manage step definition libraries, languages, formatters, and other configurable options in CucumberJS.

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

## BeforeStep and AfterStep Hooks
Older versions of CucumberJS support these hooks, but the newer versions of the framework do not. These hooks provide the scenario context as `this` and also contain the *pickle* object from the current scenario (if applicable). These hooks are integrated with CucumberJS using `setDefinitionFunctionWrapper`.
```javascript
const { BeforeStep, AfterStep } = require('cucumber-extra/hooks');

// runs before every step and hook.
BeforeStep(function({ pickle }) {

});

// runs after every step and hook.
AfterStep(function({ pickle }) {

});
```

## Step Delays and Retries

Add the following section to your `cucumber-extra.yaml` file:
```yaml
steps:
    # delay configuarion for steps.
    delay:
        # (default: 0) the number of milliseconds to wait before a step or hook is executed.
        before: 1000
        # (default: 0) the number of milliseconds to wait after a step or hook is executed.
        after: 1000
    # retry configuration for steps.
    retry:
        # (default: 0) the number of times to attempt to retry a step or hook if it fails.        
        count: 3
        # (default: 0) the number of milliseconds to wait before retrying a step.
        delay: 1000
        # (default: 0) the number of milliseconds to add to the delay on each retry attempt.
        backoff: 2000
}
```

## Enhanced Type Handling
This package supports an enhanced type system for CucumberJS which can detect and process numbers, strings, and javascript constants as well as full JSON objects. This is especially useful if you are writing tests which interact directly with HTTP web services. String literals are also supported, which allows for entering whitespaces.

Add the following section to your `cucumber-extra.yaml` file:
```yaml
types:
    # (default: false) whether or not to use enhanced types.
    enabled: true
    # (default: true) whether or not to support types not normally handled by CucumberJS (boolean, JSON, string literals)
    useExtendedTypes: true
```
Example:
```gherkin
Scenario: some sort of test
Given the user enters these items:
| item1 | item2 | item3 | item4 | item5 | item6 | item7 | item8 | item9  | item10 |
| 1     | 2.0   | null  | true  | false | abcde | "   " |       | "true" | "8.0"  |
```
Without Enhanced Types:
```javascript
[
  {
    item1: '1',
    item2: '2.0',
    item3: 'null',
    item4: 'true',
    item5: 'false',
    item6: 'abcde',
    item7: '"   "',
    item8: '',
    item9: '"true"',
    item10: '"8.0"'
  }
]
```

With Enhanced Types:
```javascript
[
  {
    item1: 1,
    item2: 2.0,
    item3: null,
    item4: true,
    item5: false,
    item6: 'abcde',
    item7: '   ',
    item8: '',
    item9: 'true',
    item10: '8.0'
  }
]
```

## Templates
This package allows for all step definition parameters including tables to be processed through a templating engine, which allows for the scenario context and any other relevant sources of data to be referenced directly from the feature file. Common uses for this functionality include:
- Handling object IDs which change for every test
- Updating information based on existing data
- Reusing common test data from an external source (JSON, CSV, YAML)
- Creating more flexible and reusable step definitions

### Supported Engines
- es6 - [ES6 Dynamic Templates](https://www.npmjs.com/package/es6-dynamic-template)
- handlebars - [Handlebars](https://www.npmjs.com/package/handlebars)
- expand-template - [expand-template library](https://www.npmjs.com/package/expand-template)
- Custom engines

Add the following section to your `cucumber-extra.yaml` file:
```yaml
templates:
    # (default: false) whether or not to enable templates.
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
const { addToContext } = require('cucumber-extra/templates');

// load your config into the context to reuse commonly needed values
addToContext(require('config'));

addToContext({ someValue1: 12345 });

```

Processing a value with the templating system:
```javascript
const { getValue } = require('cucumber-extra/templates');
contexts = []; // additional context objects to add.
const value = getValue("{{someValue}}", ...contexts);
```

Adding a custom templating engine:
```javascript
const { addEngine } = require('cucumber-extra/templates');

addEngine('custom-engine', (value) => {
    let result = value;
    // ... do something with the value.
    return result;
});
```
Template engines such as lodash templates and ejs are not supported out-of-the-box because they encourage the use of embedded javascript, which should be avoided if possible. The recommended engines to use are ES6 for simple placeholder support, or Handlebars for more advanced capabilities.

## Object Change Tracking and Cleanup
Add the following section to your `cucumber-extra.yaml` file:
```yaml
tracking:
    # (default: false) whether or not to use change tracking.
    enabled: true
    # (default: true) whether or not to clean up objects automatically.
    performCleanup: true
```

Register an object type to the tracker:
```javascript
const { addObjectType } = require('cucumber-extra/tracking');
addObjectType('users', {
    scope: 'scenario', // (default: scenario) what scope level to track at.
    key: user => user.id, // how to uniquely identify the object.
    cleanup: (user, metadata) => { /* clean up the user... */ }
});
```

Track an object:
```javascript
const { trackObject } = require('cucumber-extra/tracking');

// the actual object to be tracked.
const user = { id: 123, name: 'Jimmy' };

// any metadata relevant to the object (tokens, etc.)
const metadata = { token: this.currentToken };

trackObject('users', user, metadata);
```

Report a change to a tracked object:
```javascript
const { updateObject } = require('cucumber-extra/tracking');

// the actual object that changed.
const user = { id: 123, name: 'James' };

updateObject('users', user);
```

Untrack an object:
```javascript
const { untrackObject } = require('cucumber-extra/tracking');

// the keys of the object to untrack.
const user = { id: 123 };
// (default: false) whether or not to perform a cleanup as well.
const performCleanup = true;

untrackObject('users', user, performCleanup);
```

All tracked objects with a scope level of `scenario` will automatically be deleted in the reverse order in which they were created during the test unless the `@extra-no-cleanup` test tag is specified on the scenario or the `tracking.performCleanup` setting is disabled.

## Performance Monitoring
Add the following section to your `cucumber-extra.yaml` file:
```yaml
performance:
    # (default: false) whether or not to use performance monitoring.
    enabled: true
    # (default: 0) the minimum running time to keep data from.
    threshold: 1000
    # (default: console) a file to output the results, or the console.
    output: console
```