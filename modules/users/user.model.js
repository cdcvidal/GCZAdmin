'use strict';
var Backbone = require('backbone');
var appConfig = require('../main/config');
var _ = require('lodash');

var Model = Backbone.Model.extend({
    urlRoot: appConfig.apiBaseURL + '/clusters',
    config: {
      alertLanguages: ['en', 'fr']
    }
});

module.exports = Model;
