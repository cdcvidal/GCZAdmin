'use strict';
var Backbone = require('backbone');
var appConfig = require('../main/config');
var i18n = require('i18next-client');

var Model = Backbone.Model.extend({
    defaults: {
      name: 'devices',
      sortModel: {
        colId: 'name',
        sort: 'asc'
      },
      columnDefs: [{
        field: 'name',
        type: 'text'
      }, {
        field: 'id',
        type: 'text'
      }, {
        field: 'type',
        type: 'text'
      }, {
        field: 'last_value_timestamp',
        type: 'date'
      }, {
        field: 'lat',
        type: 'number'
      }, {
        field: 'lng',
        type: 'number'
      }]
    },

    url: appConfig.apiBaseURL + '/devices/'
});

module.exports = Model;
