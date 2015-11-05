const React = require('react');


class Youchart extends React.Component {
  render() {
    const {
        count,
        name,
        level
        } = this.props
    return (<div className="youchart">
      <div className={'youchart-title youchart-title-lvl_' + level}>
        <div className="youchart-name">{name}</div>
        <div className="youchart-count">{count}</div>
      </div>
      <div className={'youchart-line youchart-line-steps youchart-line-lvl_' + level}>
        <ul className="youchart-steps">
          <li className="youchart-step youchart-step-lvl_0">0</li>
          <li className="youchart-step youchart-step-lvl_1">1</li>
          <li className="youchart-step youchart-step-lvl_2">2</li>
          <li className="youchart-step youchart-step-lvl_3">3</li>
          <li className="youchart-step youchart-step-lvl_4">4</li>
          <li className="youchart-step youchart-step-lvl_5">5</li>
          <li className="youchart-step youchart-step-lvl_6">6</li>
          <li className="youchart-step youchart-step-lvl_7">7</li>
          <li className="youchart-step youchart-step-lvl_8">8</li>
          <li className="youchart-step youchart-step-lvl_9">9</li>
          <li className="youchart-step youchart-step-lvl_10">10</li>
        </ul>
      </div>

    {this.props.children}
    </div>)
  }
}
Youchart.defaultProps = {
  count: 0,
  name: 'Noname',
  level: 1,
}

module.exports = Youchart