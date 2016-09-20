'use strict';
var Backbone = require('backbone');
var appConfig = require('../main/config');

var Model = Backbone.Model.extend({
    defaults: {
      name: 'devices',
      sortModel: {
        colId: 'name',
        sort: 'asc'
      },
      columnDefs: [{
        field: 'name',
        type: 'text',
        pinned: 'left',
        suppressSizeToFit: true,
        width: 250
      }, {
        field: 'id',
        type: 'text'
      }, {
        field: 'msid',
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
      }, {
        minWidth: 0,
        width: 50,
        suppressSizeToFit: true,
        pinned: 'right',
        cellRenderer: function(params) {
          return '<a class="btn btn-primary btn-xs" href="#devices/'+(params.data.id)+'">Edit</a>';
        }
      }]
    },

    url: appConfig.apiBaseURL + '/devices'
});

module.exports = Model;
