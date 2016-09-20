'use strict';
var Backbone = require('backbone');
var appConfig = require('../main/config');

var Model = Backbone.Model.extend({
    defaults: {
      name: 'clusters',
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
        cellRenderer: function(params) {
          return '<a class="btn btn-primary btn-xs" href="#clusters/'+(params.data.id)+'">Edit</a>';
        }
      }]
    },

    url: appConfig.apiBaseURL + '/clusters'
});

module.exports = Model;
