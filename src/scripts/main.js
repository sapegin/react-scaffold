require('normalize.css/normalize.css');
require('../styles/main.scss');

// this mixes underscore.string into lodash.
// that way, when you require lodash in other files
// you'll get the version that's already in memory, that also contains
// underscore.string.
require('lodash').mixin(require('underscore.string').exports());

var Events = require('minivents');
var StateManager = require('./state_manager.js');

class App {

  constructor() {
    this.stateManager = new StateManager(this);
    this.changeState = this.stateManager.changeState.bind(this.stateManager);
    this.changeUrl = this.stateManager.changeUrl.bind(this.stateManager);
    this.initializeModules();
    this.stateManager.start();
  }

  initializeModules() {
    new (require('./modules/root/main'))(this);
    new (require('./modules/error/main'))(this);
  }
}

Events(App.prototype);

// TODO: remove window var
window.app = new App();
