require 'normalize.css/normalize.css'
require '../styles/main.scss'

# this mixes underscore.string into lodash.
# that way, when you require lodash in other files
# you'll get the version that's already in memory, that also contains
# underscore.string.
require('lodash').mixin(require('underscore.string').exports())

Events = require 'minivents'
StateManager = require './state_manager.coffee'

class App
  Events @prototype

  constructor: ->
    @stateManager = new StateManager @
    @changeState = @stateManager.changeState.bind @stateManager
    @changeUrl = @stateManager.changeUrl.bind @stateManager
    @initializeModules()
    @stateManager.start()

  initializeModules: ->
    new (require './modules/error/main')(@)

# TODO: @camacho 3/12/15 - remove window var
window.app = new App()
