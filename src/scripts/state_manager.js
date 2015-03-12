var _ = require('lodash');
var MiniRouter = require('mini-router');
var middleware = require('./middleware/main.js');
var states = require('./states.json');

class Router extends MiniRouter {
  constructor(changeState) {
    super();
    this.configureRoutes(changeState);
    this.set();
  }

  navigate(path, options =  {}) {
    if(options.reload) {
      window.location = path;
    } else {
      this.set(path, !!options.silent);
    }
  }

  configureRoutes(changeState) {
    Object.keys(states).forEach(function(stateName) {
      var stateOptions = states[stateName];

      // Get only the states that have paths defined
      if(!stateOptions.path) return;

      this.add(stateOptions.path, changeState.bind(this, stateName, {force: true}));
    }.bind(this));
  }
}

class StateManager {
  constructor(app) {
    this.app = app;
  }

  start() {
    this.router = new Router(this.changeState.bind(this));
  }

  changeUrl() {
    this.router.navigate(...arguments);
  }

  changeState(name, options = {}, params = {}) {
    console.log('change state called');

    if(this.lastState &&
      name == this.lastState.name &&
      _.isEqual(this.lastState.params, params) &&
      !options.force)
      return;

    this.lastState = {
      name: name,
      params: params
    };

    var requestProps = {
      name: name,
      options: options,
      params: params
    };

    var request = _.extend(requestProps, states[name]);

    this.app.emit('before:state', request);

    if(this.middlewareQueue) {
      this.middlewareQueue.reject();
    }

    this.middlewareQueue = middleware(request, this.app);
  }
}

module.exports = StateManager;
