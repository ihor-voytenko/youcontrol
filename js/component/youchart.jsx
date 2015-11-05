const React = require('react');


class Youchart extends React.Component {
  render () {
    console.log('Youchart', this.props);
    return <div>Youchart 2 {this.props.children}</div>
  }
}

module.exports = Youchart