var asyncQueue = require('asyncQueue');
var _ = require('lodash');

var callbacks = [ require('./state.js'), require('./error.js') ];

var queue = [];

callbacks.forEach(function(callback) {
  if( _.isArray(callback)) {
    queue = queue.concat(callback);
  } else {
    queue.push(callback);
  }
});

module.exports = function(...args) { asyncQueue(args, queue) };
