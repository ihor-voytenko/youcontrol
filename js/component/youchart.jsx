const React = require('react');
const cx = require('classnames');
const $ = require('jquery');

const pallete = {
  [10]: '#97ce34',
  [18]: '#93cc36',
  [24]: '#fef100',
  [26]: '#bce121',
  [30]: '#d0ea16',
  [36]: '#d5ec13',
  [43]: '#eef107',
  [47]: '#f4f104',
  [48]: '#f5f104',
  [53]: '#ffee00',
  [62]: '#ffe300',
  [63]: '#ffe700',
  [64]: '#ffdf01',
  [76]: '#ff9204',
};

console.log('youchart outside')
class Youchart extends React.Component {
  constructor() {
    super();
    this.state = {}
  }

  onYearHover(level, ev) {
    this.setState({
      level: level
    })
  }

  render() {
    console.log('youchart')

    const {
        name,
        type,
        } = this.props;

    const mods = this.props.mods.split('|');

    const level = this.state.level || this.props.level

    var count = type === 'years'
        ? this.props.years[level - 1].percent + '%'
        : this.props.count

    const titleClass = cx({
      'youchart-title': true,
      ['youchart-title-lvl_' + level]: type === 'step' || type === 'grad'
    }, {
      'youchart-title-thin': type === 'years',
      ['youchart-title-year_' + ((level < 10) ? '0' + level : level)]: type === 'years'
    });


    var titleStyle = (function () {
      var titleStyle = {};
      if (type === 'years' && !isUndefined(this.props.years)) {
        const palleteColor = pallete[this.props.years[level - 1].percent];

        titleStyle = Object.assign({}, titleStyle, {
          backgroundColor: palleteColor,
          color: getContrast(palleteColor.slice(1)) <= 205
              ? '#ffffff'
              : '#4c4c4c'
        });
      }
      return titleStyle
    }.bind(this))();


    const lineClass = cx({
      'youchart-line': true,
      'youchart-line-step': type === 'step',
      'youchart-line-grad': type === 'grad',
      'youchart-line-reverse': inArray(mods, 'reverse'),
    })

    const stepsClass = cx({
      'youchart-steps': true,
      'youchart-steps-grad': type === 'grad'
    })
    const nameClass = cx({
      'youchart-name': true,
      'youchart-name-thin': type === 'years'
    })
    const countClass = cx({
      'youchart-count': true,
      'youchart-count-thin': type === 'years'
    })


    const content = (function () {
      if (type === 'years') {
        const yearsData = this.props.years;

        if (!yearsData) {
          console.warn('Years is empty :(');
          return
        }
        const onYearHover = this.onYearHover.bind(this);

        const years = yearsData.map(function (year, i, list) {
          const style = {
            'backgroundColor': pallete[year.percent],
            'height': year.percent + '%'
          };

          return <div className="youchart-year" key={year.year} onMouseEnter={onYearHover.bind(null, i + 1)}>
            <div className="youchart-yearpos">
              <div className="yochart-yearline" style={style}></div>
            </div>
            <div className="yochart-yearcount">
              {(i === 0 || i === list.length - 1) ? year.year : year.year.toString().slice(-2)}
            </div>
          </div>
        });


        const verticalgradClass = cx({
          'youchart-verticalgrad': true,
          'youchart-verticalgrad-step': inArray(mods, 'step'),
          'youchart-verticalgrad-reverse': inArray(mods, 'reverse')
        })

        return <div className="youchart-years">
          <div className="cf">
            <div className={verticalgradClass}>
              <div className="youchart-verticalsteps">
              {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map(function (n) {
                return (<div className="youchart-verticalstep" key={n}>{n}</div>)
              })}
              </div>
            </div>

            <div className="youchart-yearslist">
              {years}
            </div>
          </div>
        </div>
      } else if (type === 'grad' || type === 'step') {

        const items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (c) {
          const num = (type === 'grad' && c !== 0)
              ? c + '0'
              : c;

          const itemClass = cx({
            "youchart-step": true,
            ["youchart-step-lvl_" + c]: type === 'step'
          }, {
            ['youchart-step-percent_' + num ]: type === 'grad' && (c === 0 || c === 10),
            "youchart-step-grad": type === 'grad'
          });

          return (<li className={itemClass} key={c}>
            {num}
          </li>)
        });
        return <div className={lineClass}>
          <ul className={stepsClass}>
            {items}
          </ul>
        </div>
      }
    }.bind(this))();

    //var textContent = '';
    //if (this.props['contentTitle']) {
    //  const text = (this.props.content ? this.props.content.split('\n') : []).map(function (txt) {
    //    return <p>{txt}</p>
    //  })
    //
    //  textContent = (<div className="youchart-content">
    //    <h4>{this.props['contentTitle']}</h4>
    //    {text}
    //  </div>)
    //}

    const blockClass = cx({
      'youchart': true,
      'youchart-yearstype': type === 'years'
    })

    const childrenClass = cx({
      'youchart-children': true,
      ['youchart-children-lvl_' + level]: true
    });

    return (<div className={blockClass}>
      <div className={titleClass} style={titleStyle}>
        <div className="youchart-inside">
          <div className={nameClass}>{name}</div>
          <div className={countClass}>{count}</div>
        </div>
      </div>
      {content}
      <div className={childrenClass}>
          {this.props.children}
      </div>
    </div>);
  }
}


Youchart.defaultProps = {
  count: 0,
  name: 'Noname',
  level: 1,
  mods: '',
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

function isUndefined(el) {
  return typeof el === 'undefined'
}
function inArray(arr, x) {
  return arr.indexOf(x) !== -1
}

/**
 * @credits: http://stackoverflow.com/questions/11867545/change-text-color-based-on-brightness-of-the-covered-background-area
 */
function getContrast(hexcolor) {
  var r = parseInt(hexcolor.substr(0, 2), 16);
  var g = parseInt(hexcolor.substr(2, 2), 16);
  var b = parseInt(hexcolor.substr(4, 2), 16);
  var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq;
}


module.exports = Youchart;