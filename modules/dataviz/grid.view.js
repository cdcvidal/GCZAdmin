var  _ = require('lodash');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var $ = require('jquery');
var i18n = require('i18next-client');
var Router = require('../routing/router');
var AgGrid = require('ag-grid');
var session = require('../main/session');
var appConfig = require('../main/config');
var CustomTextFilter = require('./aggrid_custom_text_filter');
var CustomNumberFilter = require('./aggrid_custom_number_filter');
var CustomDateFilter = require('./aggrid_custom_date_filter');

var moment = require('moment');

var utils_1 = require('../../node_modules/ag-grid/dist/lib/utils');
var LINE_SEPARATOR = '\r\n';

var Layout = Marionette.LayoutView.extend({
  template: require('./grid.tpl.html'),
  className: 'grid-view',
  pageSize: 50,
  elementSelector: '#grid',

  initialize: function(options) {

  },
});

module.exports = Layout;
