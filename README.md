# CucumberJS *Extra*
Extra tools and utilities for CucumberJS :cucumber:
- Standardized and consolidated step library module importing.
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
In the `./features/support` directory, create a file `cucumber-extra.js`:
```javascript
require('cucumber-extra')();
```

Create a `.cucumber-extra.json` file in your project to configure various aspects of the add-ins.

## Modules Support
CucumberJS loads step definitions and hooks from the `./features` directory of your project, but doesn't have built-in support for loading step definition libraries from other packages. Existing step definition packages often return a function for you to call from your project when it starts. This package provides a concise way of including multiple step definition libraries.

### Loading Step Definition Libraries from NPM
1) Install your dependencies using NPM. Example:
```bash
npm install <npm package name> --save-dev
```

2) Add the following section to your `.cucumber-extra.json` file:
```json
{
    ...
    "modules": [
        "<npm package name>"
    ],
    ...
}
```
Note: the module loader will look for a `load()` function, but if the default exported object is a function is will attempt to call that instead.

### Creating a Step Definition Library
1) Add `cucumber` as a peer dependency to your project.
2) export a function `load()` from your library which will initialize your step definitions:
```javascript
function load() {
    require('./features/step_definitions/steps1');
    require('./features/step_definitions/steps2');
    require('./features/support/hooks');
}

module.exports = {
    load,
    ... // other functions you want to expose from your library...
}
```
Note: you can also return the load function as the default export, but you may want to expose other functions as part of your package.

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

Add the following section to your `.cucumber-extra.json` file:
```json
{
    ...
    "steps": {
        "delay": {
            // (default: 0) the number of milliseconds to wait before a step or hook is executed.
            "before": 1000,
            // (default: 0) the number of milliseconds to wait after a step or hook is executed.
            "after": 1000
        },
        "retries": {
            // (default: 0) the number of times to attempt to retry a step or hook if it fails.
            "count": 3,
            // (default: 0) the number of milliseconds to wait before retrying a step.
            "delay": 1000,
            // (default: 0) the number of milliseconds to add to the delay on each retry attempt.
            "backoff": 2000
        }
    },
    ...
}

## Enhanced Type Handling
This package supports an enhanced type system for CucumberJS which can detect and process numbers, strings, and javascript constants as well as full JSON objects. This is especially useful if you are writing tests which interact directly with HTTP web services. String literals are also supported, which allows for entering whitespaces.

Add the following section to your `.cucumber-extra.json` file:
```json5
{
    ...
    "types": {
        // (default: false) whether or not to use enhanced types.
        "enabled": true, 
        // (default: true) whether or not to support types not normally handled by CucumberJS (boolean, JSON, string literals)
        "useExtendedTypes": true
    }
    ...
}
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

Add the following section to your `.cucumber-extra.json` file:
```json
{
    ...
    "templates": {
        // (default: false) whether or not to enable templates.
        "enabled": true,
        // (default: es6) which template engine to use.
        "engine": "handlebars"
    }
    ...
}
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
Note: template engines such as lodash templates and ejs are not supported out-of-the-box because they encourage the use of embedded javascript. The recommended engines to use are ES6 for simple placeholder support, or Handlebars for more sophisticated solutions.

## Object Change Tracking and Cleanup
Add the following section to your `.cucumber-extra.json` file:
```json
{
    ...
    "tracking": {
        // (default: false) whether or not to use change tracking.
        "enabled": true,
        // (default: true) whether or not to clean up objects automatically.
        "performCleanup": true
    }
    ...
}
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
Add the following section to your `.cucumber-extra.json` file:
```json
{
    ...
    "performance": {
        // (default: false) whether or not to use performance monitoring.
        "enabled": true,
        // (default: 0) the minimum running time to keep data from.
        "threshold": 1000,
        // (default: console) a file to output the results, or the console.
        "output": "console"
    ...
}
```