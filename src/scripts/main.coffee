require 'normalize.css/normalize.css'
require '../styles/main.scss'
Events = require 'minivents'
StateManager = require './state_manager.coffee'

class App
  Events @prototype

  constructor: ->
    @stateManager = new StateManager @
    @changeState = @stateManager.changeState.bind @stateManager
    @changeUrl = @stateManager.changeUrl.bind @stateManager
    @stateManager.start()

# TODO: @camacho 3/12/15 - remove window var
window.app = new App()
