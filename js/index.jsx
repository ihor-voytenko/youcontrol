/** @jsx React.DOM */
'use strict'

var ReactDOM = require('react-dom');
var React = require('react');

const components = {
  youchart: require('./component/youchart.jsx')
};


/* генерим react-компоненты из под серверных шаблонов */




window.renderReactComponents = (function(dom){
  // Store the old jQuery.cleanData
  var oldClean = $.cleanData;

  // Overwrites cleanData which is called by jQuery on manipulation methods
  $.cleanData = function( elems ) {
    for ( var i = 0, elem;
          (elem = elems[i]) !== undefined; i++ ) {
      // Trigger the destroyed event
      $(elem).triggerHandler("removed");
    }
    // Call the old jQuery.cleanData
    oldClean(elems);
  };

  return function(dom) {
    $('.jr:not(.jr-activated)', dom).each(function(){
      var domEl = this,
          jqEl = $(this),
          data = jqEl.data() || {},
          component = components[data.component];

      if (!component) {
        return console.error('Didnt find component', data.component, jqEl)
      }

      const updateInDom = (function(props){
        return function (newProps, children) {
          props = Object.assign(props, newProps)
          children = children || ''

          ReactDOM.render(
              React.createFactory(component)(props, [children]),
              domEl
          );
        }
      })({})

      updateInDom(
          Object.assign({}, data, {component: undefined}),
          jqEl.text()
      )

      // кешируем, отмечаем выполненными
      jqEl.data('update', updateInDom).addClass('jr-activated');

      jqEl.on('removed', function(){
        ReactDOM.unmountComponentAtNode(this);
      });
    });
  }
})()

jQuery(function($){
  renderReactComponents(document.body)
});

