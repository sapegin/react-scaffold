var React = require('react');

var RootComponent = React.createClass({
  render() {
    return (
      <div>
        HOME
      </div>
    );
  }
});

class Root {
  constructor(app) {
    this.app = app;
    this.subscribe();
  }

  subscribe() {
    this.app.on('state:root', this.renderReactComponent.bind(this));
  }

  renderReactComponent(request) {
    React.render(
      <RootComponent />,
      document.body
    );
  }
}

module.exports = Root;
