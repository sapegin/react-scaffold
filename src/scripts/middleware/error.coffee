module.exports = (err, request, app, next) ->
  console.error err
  app.changeState 'error'
  next err
