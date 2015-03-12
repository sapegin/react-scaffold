_ = require 'lodash'
Router = require 'mini-router'
middleware = require './middleware/main.coffee'
states = require './states.coffee'

class Router extends Router
  constructor: (changeState) ->
    super
    @configureRoutes changeState
    @set()

  navigate: (path, options =  {}) ->
    if options.reload
      window.location = path
    else
      @set path, !!options.silent

  configureRoutes: (changeState) ->
    for stateName, stateOptions of states
      # Get only the states that have paths defined
      continue unless stateOptions.path?
      @add stateOptions.path, changeState.bind @, stateName, force: true

class StateManager
  constructor: (@app) ->

  start: ->
    @router = new Router @changeState.bind(@)

  changeUrl: ->
    @router.navigate arguments...

  changeState: (name, options = {}, params = {}) ->
    console.log 'change state called'

    if @lastState and
    name is @lastState.name and
    _.isEqual(@lastState.params, params) and
    not options.force
      return

    @lastState =
      name: name
      params: params

    requestProps =
      name: name
      options: options
      params: params

    request = _.extend requestProps, states[name]

    @app.emit 'before:state', request

    @middlewareQueue?.reject()
    @middlewareQueue = middleware request, @app

module.exports = StateManager
