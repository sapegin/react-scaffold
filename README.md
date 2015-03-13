#React Scaffold

An opinionated setup built on learnings from large applications that ties together routes, states, business logic, and React components.

It can be easily combined with other frameworks, like [Flux](http://facebook.github.io/react/docs/flux-overview.html), for greater functionality.

Overview
--------
This repo aims to provide you with a cloneable starting point for your React project. It consists of:
* [webpack](http://webpack.github.io/) configuration and dev server
* A lightweight router ([mini-router](https://github.com/daftdevelopers/mini-router))
* Simple stateful architecture with middleware ([rygr.asnyc-queue](https://github.com/camacho/rygr.async-queue))
* Straightforward eventing system ([minivents](https://github.com/allouis/minivents))
* [React](http://facebook.github.io/react/)

Directory Structure
-------------------
```
| build
  - index.html
| src
  | scripts
    | middleware
      - error.js
  	  - main.js
      - state.js
    | modules
      | error
        - main.js
      | root
        - main.js
    - main.js
    - state_manager.js
    - states.json
  | styles
    - main.scss
- webpack.config.js

```

Under each directory, entry files are denoted by the `main.(js|scss|etc)` convention.

webpack
-------
The webpack configuration can be found in the root [webpack.config.js](webpack.config.js). It is used in combination with the `npm start` command find in [package.json](package.json#L43) to spin up a [webpack dev server](http://webpack.github.io/docs/webpack-dev-server.html).

Out of the box, webpack is configured to create two bundles:

1. vendor.bundle.js
2. bundle.js

Although webpack is capable of supporting both AMD and CommonJs specs, this project has elected to only use the latter. This can be changed at any point, depending on your project needs.

The webpack config is setup with a few helpful loaders out of the box:

* coffee
* js|jsx
* png|woff
* json
* css
* scss (with [bourbon](http://bourbon.io/docs/))

The web dev server can be started by running `npm start`. In the [package.json](package.json#L43) file, you can edit the various flags that have been set under the `start` script. By default, `npm start` runs:

```sh
$ webpack-dev-server --hot --progress --colors --content-base build --history-api-fallback
```

**Important - the `history-api-fallback` flag is necessary for providing pushstate support**


Architecture
------------

### States (as first class citizens)
Most applications use routes as a source of state within an application. This can create some difficult situations when trying to handle non-url-persisted state within an application (error state, signup state, authentication state, etc).

To handle these types of situations, this architecture separates out routing and state management, and maintains a series of statically defined states in the [states.json](states.json) file.

A state definition consists of a key and a hash of options. Whenever a state is emitted, a state transition is kicked off, with the options being passed along.

State changes can be called via the app, and are asynchronous:

```js
app = require('./main')
app.changeState('stateName', {options}, {params});
```

**Important - A state can be forced to reload (even if the params and name are identical) by passing `{force: true}` as an option**

### Routes
**Important - routes can be assigned to states by adding a `path` attribute to the state options hash**

```json
# ./states.json
{
  "root": {
  	"path": "/"
  }
}
```

Routes are used to inform the state of the application, but are not required for representing a state. Some states, like the error state, are not given any path.

Path descriptions leverage [mini-router](https://github.com/daftdevelopers/mini-router) syntax. `*`, `:param`, etc. The parameterized aspects of a route will be passed in as a `key: value` hash to the state change call.

Routes can be changed by calling `changeUrl('path',{options})` on the app.

```js
app = require('./main')
app.changeUrl('path', {options});
```

When a `urlChange` is called, the router updates the url via pushstate, which triggers a state change within the app.

**Important - Pass `{silent: true}` as an option to update the url without firing a state change event***

### Middleware

The middleware is nothing more than a queue of methods that get executed whenever a state change occurs, [similar to Express middleware](http://expressjs.com/guide/using-middleware.html), which fires on every request to the server.

The middleware allows you to break down essential, repeating business logic into discrete functions via an [AsyncQueue](https://github.com/camacho/rygr.async-queue).

The middleware queue is built in `middleware/main.js`. All methods receive three arguments:

```js
module.exports = function(request, app, next){
  // Request object will have the name of the state and any parameters
  // To continue to the next function in the queue, call next with no arguments
  next();

  // To surface an error and jump to the error handler, call next with an argument
  next(new Error('Something went wrong!'));
};
```

Calling next with an error will force the queue to skip all the way to the first error method, which is defined by having an arity of 4

```js
module.exports = function(err, request, app, next){
  // This method will only be executed if there is an error
  // It is possible to have multiple error handlers in the middleware
  // by continuing to call `next` with the err
}
```

### Events

One of the central aspects of the architecture is the ability for modules to subscribe to the central routing of the app. Using [minivents](https://github.com/allouis/minivents), the core App started in `scripts/main.js` is given a simple eventing interface:

* on : Listen to event. Params { type:String, callback:Function | context:Object }
* off : Stop listening to event. Params { type:String | callback:Function }
* emit: Emit event. Params { type:String | data:Object }

These events are used by modules to subscribe to various states of the application, and used by the middleware to fire off state changes.

It is possible to add any additional events needed, or mixin [minivents](https://github.com/allouis/minivents) into any object that needs a pub/sub interface.

### Modules

Modules are where the meat of the application exists. They allow for separation of logic along discrete functional lines.

Typically, a module will respond to one more states by subscribing to the app state change events, but that is not a requirement.

A common case is to use a module as a starting point for any UI behavior:

```js
// modules/root/main.js

var RootReactComponent = React.createClass({
  render: function() {
    ...
  }
});

class Root {
  constructor(app) {
    this.app = app;
    this.subscribe();
  }

  subscribe() {
    this.app.on('state:root', this.renderReactComponent.bind(this));
  }

  renderReactComponent(request) {
    ...
  }
}

module.exports = Root;
```
