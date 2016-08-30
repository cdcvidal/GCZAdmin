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
        field: 'clientName',
        type: 'text'
      }]
    },

    url: appConfig.apiBaseURL + '/clusters'
});

module.exports = Model;
