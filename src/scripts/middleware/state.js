var triggerNewState = function(request, app, next) {
  console.log(`state now ${request.name}!`);
  app.emit(`state:${request.name}`, request);
  next();
}

var triggerStateChange = function(request, app, next) {
  console.log("state changed!");
  app.emit('state:change', request);
  next();
}

// Returns state events that will fire in specified order
// when a state change is requested through the app
module.exports = [triggerNewState, triggerStateChange];
