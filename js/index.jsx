'use strict'

require('./vendor/es5-shim.js');
require('./vendor/es5-sham.js');
require('./vendor/console.pol.js');

var React = require('react');

require('./jquery-to-react').init({
  youchart: require('./component/youchart.jsx')
});
