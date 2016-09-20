'use strict';
var Backbone = require('backbone');
var $ = require('jquery');
var appConfig = require('../main/config');
var _ = require('lodash');

var Model = Backbone.Model.extend({
    urlRoot: appConfig.apiBaseURL + '/clusters',
    config: {
      alertLanguages: ['en', 'fr']
    },
    getRevisionsBaseUrl: function() {
      return appConfig.apiBaseURL +'/clusters/'+ this.get('id') +'/revisions';
    },
    loadRevisions: function() {
      return $.get(this.getRevisionsBaseUrl());
    },
    loadRevision: function(field, id) {
      return $.get(this.getRevisionsBaseUrl()+'/'+field+'/'+id);
    }
});

module.exports = Model;
