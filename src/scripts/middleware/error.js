module.exports = function(err, request, app, next) {
  app.changeState('error');
  next(err);
}
