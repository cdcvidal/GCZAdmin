'use strict';
var Backbone = require('backbone');
var $ = require('jquery');
var appConfig = require('../main/config');
var _ = require('lodash');

var Model = Backbone.Collection.extend({
    url: appConfig.apiBaseURL + '/drivers',
    modelId: function(attrs) {
      return attrs.driver_name;
    },
    getRevisionsBaseUrl: function() {
      return appConfig.apiBaseURL +'/drivers/revisions';
    },
    loadRevisions: function() {
      return $.get(this.getRevisionsBaseUrl());
    },
    loadRevision: function(id) {
      return $.get(this.getRevisionsBaseUrl()+'/'+id);
    }
});

module.exports = Model;
