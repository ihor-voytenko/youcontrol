const React = require('react');
const cx = require('classnames');

class Youchart extends React.Component {
  render() {
    const {
        count,
        name,
        level,
        type,
        } = this.props;

    const titleClass = cx({
      'youchart-title': true,
      ['youchart-title-lvl_' + level]: true

    });

    const lineClass = cx({
      'youchart-line': true,
      'youchart-line-step': type === 'step',
      'youchart-line-grad': type === 'grad'
    })

    const stepsClass = cx({
      'youchart-steps': true,
      'youchart-steps-grad': type === 'grad'
    })


    const items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (c) {
      const num = (type === 'grad' && c !== 0)
          ? c + '0'
          : c;

      const classPercent = 'youchart-step-percent_' + num // почему при попытке включить его прямо в ключ, валится с ошибкой компиляции ?

      const itemClass = cx({
        "youchart-step": true,
        ["youchart-step-lvl_" + c]: type === 'step',
        [classPercent]: type === 'grad' && (c === 0 || c === 10),
        "youchart-step-grad": type === 'grad'
      });

      return (<li className={itemClass} key={c}>
        {num}
      </li>)
    });

    return (<div className="youchart">
      <div className={titleClass}>
        <div className="youchart-inside">
          <div className="youchart-name">{name}</div>
          <div className="youchart-count">{count}</div>
        </div>
      </div>
      <div className={lineClass}>
        <ul className={stepsClass}>
          {items}
        </ul>
      </div>
      <div className='youchart-children'>
        {this.props.children}
      </div>
    </div>);
  }
}


Youchart.defaultProps = {
  count: 0,
  name: 'Noname',
  level: 1,
  type: 'step',
};

Youchart.propTypes = {
  level: function (props, propName, componentName) {
    if (!(props[propName] >= 0 && props[propName] <= 10)) {
      return new Error('level ' + props[propName] + ' is not allowed');
    } else {
      return null
    }
  }
};

module.exports = Youchart;