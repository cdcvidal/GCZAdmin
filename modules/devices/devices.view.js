'use strict';

var _ = require('lodash');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var GridView = require('../dataviz/grid.view');
var Devices = require('./devices.model');

module.exports = Marionette.LayoutView.extend({
  name: 'devices',
  template: require('./devices.tpl.html'),
  className: 'page devices margin-md',
  regions: {
      content: '.page-content'
  },

  initialize: function(options) {
    console.log('init device view');
  },

  onShow: function() {
    var devices = new Devices();
    var gridView = new GridView({
      model: devices
    });

    this.content.show(gridView);
  }

});
