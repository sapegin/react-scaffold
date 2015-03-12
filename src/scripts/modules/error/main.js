var React = require('react');

var ErrorReactComponent = React.createClass({
  render: function() {
    return (
      <div>
        <p> Error at: </p>
        <p> {this.props.errorPath} </p>
        <p> {this.props.errorText} </p>
      </div>
    );
  }
});

class Err {
  constructor(app) {
    this.app = app;
    this.subscribe();
  }

  subscribe() {
    this.app.on('state:error', this.renderReactComponent.bind(this));
  }

  renderReactComponent(request) {
    React.render(
      <ErrorReactComponent errorText={request.params.error} errorPath={request.params.path} />,
      document.body
    )
  }
}

module.exports = Err;
