asyncQueue = require 'asyncQueue'
_ = require 'lodash'

callbacks = [
  require './state.coffee'
  require './error.coffee'
]

queue = []

for callback in callbacks
  if _.isArray callback
    queue = queue.concat callback
  else
    queue.push callback

module.exports = (args...) -> asyncQueue args, queue
