module.exports = (err, request, app, next) ->
  app.changeState 'error'
  next err
