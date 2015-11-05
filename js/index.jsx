/** @jsx React.DOM */
'use strict'

var ReactDOM = require('react-dom');
var React = require('react');

const components = {
  youchart: require('./component/youchart.jsx')
};


/* генерим react-компоненты из под серверных шаблонов */
window.renderReactComponents = function(dom){
  $('.jr:not(.jr-activated)', dom).each(function(){
    var domEl = this,
        jqEl = $(this),
        data = jqEl.data() || {},
        component = components[data.component];

    if (!component) {
      return console.error('Didnt find component', data.component, jqEl)
    }
    const props = Object.assign({}, data, {component: undefined});


    const reactComponent = ReactDOM.render(
        React.createFactory(component)(props, [jqEl.html()]),
        domEl
    );

    // кешируем, отмечаем выполненными
    jqEl.data('react-component', reactComponent).addClass('jr-activated');
  });
};

jQuery(function($){
  renderReactComponents(document.body)
});

