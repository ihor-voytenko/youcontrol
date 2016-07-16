/* генерим react-компоненты из под серверных шаблонов */
"use strict";

var ReactDOM = require('react-dom');
var React = require('react');
var $ = require('jquery');


var findAndRender = (function () {
  var options = {
    className: 'jr',
    classNameActivated: 'jr-activated'
  };

  /**
   * @credits: https://github.com/bitovi/$pp/blob/master/event/removed/removed.js
   * */
  (function () {
    // Store the old $.cleanData
    var oldClean = $.cleanData;

    // Overwrites cleanData which is called by $ on manipulation methods
    $.cleanData = function (elems) {
      for (var i = 0, elem;
           (elem = elems[i]) !== undefined; i++) {
        // Trigger the destroyed event
        $(elem).triggerHandler("removed");
      }
      // Call the old $.cleanData
      oldClean(elems);
    };
  })();


  return function ({dom, components}) {
    $(`.${options.className}:not(.${options.classNameActivated})`, dom).each(function () {
      var domEl = this,
          jqEl = $(this),
          propsFromData = jqEl.data() || {},
          component = components[propsFromData.component];

      if (!component) {
        return console.error('Didnt find component', data.component, jqEl)
      }


      var updateInDom = (function () {
        var props = {};
        return function (component, newProps, children) {
          props = Object.assign(props || {}, newProps)
          ReactDOM.render(
              React.createFactory(component)(
                  props,
                  getReactNodesFromTree(getReactCompatibleTreeFromDomNode(children))
              ),
              domEl
          );
        }
      })();

      updateInDom(
          component,
          Object.assign({}, propsFromData, {component: undefined}),
          jqEl.children().get()
      );

      // кешируем, отмечаем выполненными
      jqEl.data('update', function(newProps){
        updateInDom(component, newProps, jqEl.children().get())
      }).addClass(options.classNameActivated);

      jqEl.on('removed', function () {
        ReactDOM.unmountComponentAtNode(this);
      });
    })
  }
})();

module.exports = {
  //render: findAndRender,
  init: function (componentsHash) {
    // todo: $?

    // init on $ dom ready
    $(function () {
      findAndRender({
        dom: document.body,
        components: Object.assign({}, componentsHash)
      })
    });
  }
};

function getReactNodesFromTree(tree) {
  if (!(tree instanceof Array)) tree = [tree];

  return tree.map(function (el, i) {
    if (typeof el === 'string') return el;

    return React.createElement(
        el.tag,
        Object.assign({}, {key: i}, el.props),
        el.children.length > 0 ? getReactNodesFromTree(el.children) : undefined
    )
  })
}

/* превращаем коллекцию дом-нод в дерево для реакта */
function getReactCompatibleTreeFromDomNode(node) {
  if (node instanceof NodeList || node instanceof Array) {
    return toArray(node).map(getReactCompatibleTreeFromDomNode)
  } else if (node.nodeName === '#text') {
    return node.nodeValue
  }

  var props = reduceTree(nodeAttrsToTree(node.attributes), function (memo, value, key) {
    if (key === 'class') key = 'className';
    memo[key] = value;
    return memo;
  }, {});

  return {
    tag: node.nodeName.toLowerCase(),
    props: props,
    children: node.childNodes ? getReactCompatibleTreeFromDomNode(node.childNodes) : []
  }
}

function reduceTree(hash, iterator, memo) {
  for (var key in hash) {
    memo = iterator(memo, hash[key], key, hash)
  }
  return memo
}
function toArray(arr) {
  return Array.prototype.slice.call(arr, 0)
}
function nodeAttrsToTree(map) {
  var hash = {};
  if (!map) return hash;
  for (var i = 0; i < map.length; i++) {
    hash[map[i].nodeName] = map[i].nodeValue
  }
  return hash
}