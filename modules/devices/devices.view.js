'use strict';

var _ = require('lodash');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var $ = require('jquery');
var i18n = require('i18next-client');
var GridView = require('../dataviz/grid.view');
var appConfig = require('../main/config');
var session = require('../main/session');
var Router = require('../routing/router');
var Header = require('../header/header');
var Devices = require('./devices.model');


module.exports = Marionette.LayoutView.extend({
  name: 'devices',
  template: require('./devices.tpl.html'),
  className: 'page devices margin-md',


  initialize: function(options) {
    var self = this;
    this.showDeferred = $.Deferred();
    
    console.log('init device view');

    this.myDataSource = {
      rowCount: null,
      pageSize : 300,
      overflowSize: 10,
      maxConcurrentRequests: 2,
      getRows : function (params){
        console.log('getRows');
        //default order desc on date
        var nameColSort = "name";
        var orderSort = "asc";
        var filterQuery = "";

        var devices = new Devices();

        devices.fetch({
          data: {'sort[name]': 'asc'},
          success: function(model, response, options){
            console.log('fetch devices success', response);
            var rowsThisPage = response;
            var lastRow = -1;
            params.successCallback(rowsThisPage , lastRow);
          },
          error: function(model, response, options){
            console.log('fetch devices error', response);
          }
        });
      }
    };
  },


  onShow: function() {
    this.showDeferred.resolve();
  },


  displayGrid: function() {
    var self = this;
    this.currentView = 'grid';
    $.when( this.showDeferred).then(function( ) {
      self.initGrid();
    });
  },

  initGrid: function() {
    var self = this;
    var gridView = new GridView({
      myDataSource : self.myDataSource
    });
    this.show(gridView);
  },

});
